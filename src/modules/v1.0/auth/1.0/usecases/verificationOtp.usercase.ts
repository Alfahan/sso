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

	/**
	 * Verifies the provided OTP code for multi-factor authentication (MFA) and logs the authentication history.
	 *
	 * @param {Response} res - The Express response object, containing local variables such as the API key ID.
	 * @param {Request} req - The Express request object, containing the OTP code and other user details.
	 * @returns {Promise<{ code: string }>} - Returns a newly generated code if the OTP is valid.
	 * @throws {UnauthorizedException} - Throws an exception if the OTP is invalid, expired, or if any error occurs during verification.
	 */
	async verification(req: Request, res: Response): Promise<{ code: string }> {
		const { otp_code } = req.body; // Extracts the OTP code from the request body
		const api_key_id = res.locals.api_key_id; // API key ID from response locals
		const geo = geoip.lookup(req.ip); // Geo-location lookup based on IP address
		const agent = useragent.parse(req.headers['user-agent']); // Parses the user-agent from request headers
		const currentTime = new Date(); // Current time for checking OTP expiry

		// Find the OTP by the provided code in the repository
		const findOtp = await this.repository.findOtpByCode(
			'mfa_infos',
			TOKEN_VALID,
			otp_code,
		);

		// If OTP is not found, log the failed login attempt and throw UnauthorizedException
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

		// Check the rate limit for the user
		await this.helper.checkRateLimit(findOtp.user_id);

		// Check if the OTP has expired
		if (findOtp.expires_at < currentTime) {
			// Log the failed login attempt and invalidate the expired OTP
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

		// Generate a new code for the user and save it to the database
		const { code } = await this.helper.setCode(
			req,
			findOtp.user_id,
			api_key_id,
			geo,
			agent,
		);

		// Invalidate the used OTP and reset the user's failed login attempts
		await this.repository.updateOtp(
			'mfa_infos',
			TOKEN_INVALID,
			findOtp.mi_id,
		);
		await this.helper.resetFailedAttempts(findOtp.user_id);

		// Log the successful login attempt
		await this.helper.logAuthHistory(
			req,
			geo,
			agent,
			'LOGIN_SUCCESS',
			findOtp.user_id,
		);

		// Return the newly generated code
		return { code };
	}
}
