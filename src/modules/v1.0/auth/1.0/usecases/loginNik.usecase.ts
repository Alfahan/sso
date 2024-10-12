import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as useragent from 'useragent';
import * as geoip from 'geoip-lite';
import HCIS from '@app/libraries/hcis';
import * as bcrypt from 'bcrypt';
import { helperSplit, validateDomain } from '@app/libraries/helpers';
import {
	NIK,
	NODE_ENV,
	SEGMENT_INTERNAL,
	TOKEN_INVALID,
	TOKEN_VALID,
	USER_ACTIVE,
} from '@app/const';
import { User } from '@app/entities/user.entity';
import CryptoTs from 'pii-agent-ts';
import { v4 as uuidv4 } from 'uuid';
import { Internal } from '@app/entities/Internal.entity';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class LoginNikUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
		private readonly jwtService: JwtService,
	) {}

	async login(req: Request, res: Response): Promise<any> {
		const { nik, password } = req.body;
		const apiKeyId = res.locals.api_key_id;
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		if (!nik || !password) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const user = await this.findOrCreateUser(nik, password);
		if (!user) {
			throw new UnauthorizedException('User validation failed');
		}

		const isPasswordValid = await this.helper.isPasswordValid(
			password,
			user.password,
		);
		if (!isPasswordValid) {
			await this.handleInvalidPassword(user.id, req, geo, agent);
		}

		return await this.processCodeOrOtp(user, req, geo, agent, apiKeyId);
	}

	private async findOrCreateUser(
		nik: string,
		password: string,
	): Promise<any> {
		let user = await this.validateUser(nik);
		if (!user) {
			const userHcis = await this.validateHcis(nik, password);
			await this.register(userHcis, password);
			user = await this.validateUser(nik);
		}
		return user;
	}

	private async validateUser(nik: string): Promise<any> {
		const fullHeap = await helperSplit(nik, 'nik_text_heap');
		return this.repository.findByNik('internals', fullHeap);
	}

	private async validateHcis(nik: string, password: string): Promise<any> {
		const hcis = new HCIS();
		if (!(await hcis.validateUser(nik, password))) {
			throw new UnauthorizedException('Invalid credentials');
		}
		return hcis.profileInfo(nik);
	}

	private async register(profile: any, password: string): Promise<void> {
		const userId = uuidv4();

		if (NODE_ENV === 'PRODUCTION') {
			validateDomain(profile.email);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await this.createUser(profile, hashedPassword, userId);
		await this.createInternal(profile, userId);
	}

	private async createUser(
		profile: any,
		hashedPassword: string,
		userId: string,
	): Promise<void> {
		const user = new User();
		user.username = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			profile.nama_karyawan,
		);
		user.email = CryptoTs.encryptWithAes('AES_256_CBC', profile.email);

		const blindIndex = await CryptoTs.buildBlindIndex(user);
		const result = await this.repository.register('users', {
			id: userId,
			username: blindIndex.username,
			username_bidx: blindIndex.username_bidx,
			email: blindIndex.email,
			email_bidx: blindIndex.email_bidx,
			password: hashedPassword,
			phone: null,
			phone_bidx: null,
			segment: SEGMENT_INTERNAL,
			status: USER_ACTIVE,
		});

		if (!result) {
			throw new BadRequestException(
				'User registration failed: Username, Email, or Phone already exists',
			);
		}
	}

	private async createInternal(profile: any, userId: string): Promise<void> {
		const internal = new Internal();
		internal.nik = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			profile.nik.toString(),
		);
		internal.position = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			profile.posisi,
		);
		internal.directorate = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			profile.nama_perusahaan,
		);
		internal.division = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			profile.divisi,
		);
		internal.unit = CryptoTs.encryptWithAes('AES_256_CBC', profile.unit);

		const blindIndex = await CryptoTs.buildBlindIndex(internal);
		await this.repository.registerNik('internals', {
			user_id: userId,
			nik: blindIndex.nik,
			nik_bidx: blindIndex.nik_bidx,
			position: blindIndex.position,
			position_bidx: blindIndex.position_bidx,
			directorate: blindIndex.directorate,
			directorate_bidx: blindIndex.directorate_bidx,
			division: blindIndex.division,
			division_bidx: blindIndex.division_bidx,
			unit: blindIndex.unit,
			unit_bidx: blindIndex.unit_bidx,
			employee_status: NIK,
		});
	}

	private async handleInvalidPassword(
		userId: string,
		req: Request,
		geo: any,
		agent: any,
	): Promise<void> {
		await this.helper.incrementFailedAttempts(userId);
		await this.helper.logAuthHistory(
			req,
			geo,
			agent,
			'LOGIN_FAILED',
			userId,
		);
		throw new UnauthorizedException('Invalid credentials');
	}

	private async processCodeOrOtp(
		user: any,
		req: Request,
		geo: any,
		agent: any,
		apiKeyId: string,
	): Promise<{ code: string }> {
		const currentTime = new Date();
		const codeInfo = await this.repository.checkValidateCode('auth_codes', {
			user_id: user.id,
			api_key_id: apiKeyId,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		});

		if (codeInfo && codeInfo.expires_at > currentTime) {
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_SUCCESS',
				user.id,
			);
			await this.helper.resetFailedAttempts(user.id);
			return { code: codeInfo.code };
		}

		if (codeInfo) {
			await this.repository.updateCodeStatus(
				'auth_codes',
				TOKEN_INVALID,
				codeInfo.id,
			);
		}

		const otpCode = await this.generateAndSaveOtp(user.id, apiKeyId);
		this.helper.sendOtpVerification(
			CryptoTs.decryptWithAes('AES_256_CBC', user.email),
			otpCode,
		);
		await this.helper.resetFailedAttempts(user.id);

		throw new UnauthorizedException('Please verify your OTP.');
	}

	private async generateAndSaveOtp(
		userId: string,
		apiKeyId: string,
	): Promise<string> {
		const otpCode = this.helper.generateOtpCode();
		const expiresAt = this.helper.addMinutesToDate(new Date(), 10);
		await this.repository.saveOtp('mfa_infos', {
			otp_code: otpCode,
			expires_at: expiresAt,
			user_id: userId,
			status: TOKEN_VALID,
			api_key_id: apiKeyId,
		});
		return otpCode;
	}
}
