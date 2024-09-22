import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import * as geoip from 'geoip-lite';
import * as useragent from 'useragent';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class VerificationOtpUseCase {
	constructor(
		private readonly helper: AuthHelper,
		private readonly repository: AuthRepository,
	) {}

	async verification(res: Response, req: Request): Promise<{ code: string }> {
		const { otp_code } = req.body;
		const api_key_id = res.locals.api_key_id;
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);
		const currentTime = new Date();

		// Find OTP by code
		const findOtp = await this.repository.findOtpByCode(
			'mfa_infos',
			TOKEN_VALID,
			otp_code,
		);

		if (!findOtp) {
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_FAILED',
				null,
			);
			throw new UnauthorizedException('Invalid credentials');
		}

		// Rate limit check
		await this.helper.checkRateLimit(findOtp.user_id);

		// Check if OTP has expired
		if (findOtp.expires_at < currentTime) {
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_FAILED',
				findOtp.user_id,
			);
			await this.repository.updateOtp(
				'mfa_infos',
				TOKEN_INVALID,
				findOtp.mi_id,
			);
			throw new UnauthorizedException('OTP Expired');
		}

		// Generate new code and save to database
		const { code } = await this.helper.setCode(
			req,
			findOtp.user_id,
			api_key_id,
			geo,
			agent,
		);

		// Invalidate OTP and reset failed attempts
		await this.repository.updateOtp(
			'mfa_infos',
			TOKEN_INVALID,
			findOtp.mi_id,
		);
		await this.helper.resetFailedAttempts(findOtp.user_id);

		// Log success login
		await this.helper.logAuthHistory(
			req,
			geo,
			agent,
			'LOGIN_SUCCESS',
			findOtp.user_id,
		);

		return { code };
	}
}
