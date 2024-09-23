import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import * as useragent from 'useragent';
import * as geoip from 'geoip-lite';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
	) {}

	async login(res: Response, req: Request): Promise<{ code: string }> {
		const { email, password } = req.body;
		const api_key_id = res.locals.api_key_id;

		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		if (!email || !password) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Find user by email
		const user = await this.repository.findByEmail('users', email);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Rate limit check
		await this.helper.checkRateLimit(user.id);

		// Validate password
		const isValidPassword = await this.helper.isPasswordValid(
			password,
			user.password,
		);
		if (!isValidPassword) {
			await this.handleInvalidPassword(user.id, req, geo, agent);
		}

		// Process token or OTP if password is valid
		return await this.processTokenOrOtp(user, req, geo, agent, api_key_id);
	}

	private async processTokenOrOtp(
		user: any,
		req: Request,
		geo: any,
		agent: any,
		api_key_id: string,
	): Promise<{ code: string }> {
		const currentTime = new Date();
		const existingCode = await this.repository.cekValidateCode(
			'auth_codes',
			{
				user_id: user.id,
				api_key_id,
				ip_origin: req.ip,
				geolocation: geo
					? `${geo.city}, ${geo.region}, ${geo.country}`
					: 'Unknown',
				country: geo?.country || 'Unknown',
				browser: agent.toAgent(),
				os_type: agent.os.toString(),
				device: agent.device.toString(),
			},
		);

		console.log(existingCode);

		if (existingCode) {
			if (existingCode.expires_at < currentTime) {
				await this.repository.updateCodeStatus(
					'auth_codes',
					TOKEN_INVALID,
					user.id,
				);
				const { code } = await this.helper.setCode(
					req,
					user.id,
					api_key_id,
					geo,
					agent,
				);
				return { code: code };
			}

			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_SUCCESS',
				user.id,
			);
			return { code: existingCode.code };
		}

		// Check for active OTP
		const findOtp = await this.repository.findOtpByUserId(
			'mfa_infos',
			TOKEN_VALID,
			user.id,
		);
		if (findOtp && findOtp.expires_at > currentTime) {
			const timeDiff = Math.ceil(
				(findOtp.expires_at.getTime() - currentTime.getTime()) / 60000,
			);
			await this.helper.incrementFailedAttempts(user.id);
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_FAILED',
				user.id,
			);
			throw new Error(
				`OTP already sent. Please wait ${timeDiff} minute(s) to request again.`,
			);
		}

		// Generate new OTP
		const otpCode = this.helper.generateOtpCode();
		const otpExpired = this.helper.addMinutesToDate(new Date(), 10);
		await this.repository.saveOtp('mfa_infos', {
			otp_code: otpCode,
			expires_at: otpExpired,
			user_id: user.id,
			status: TOKEN_VALID,
			api_key_id,
		});

		this.helper.sendOtpVerification(user.email, otpCode);
		await this.helper.resetFailedAttempts(user.id);

		throw new UnauthorizedException('Please verify your OTP.');
	}

	private async handleInvalidPassword(
		user_id: string,
		req: Request,
		geo: any,
		agent: any,
	) {
		await this.helper.incrementFailedAttempts(user_id);
		await this.helper.logAuthHistory(
			req,
			geo,
			agent,
			'LOGIN_FAILED',
			user_id,
		);
		throw new UnauthorizedException('Invalid credentials');
	}
}
