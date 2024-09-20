import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import * as geoip from 'geoip-lite'; // Library to get geolocation data
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)
import { AuthHelper } from '../auth.helper';

/**
 * @service VerificationOtpUseCase
 * @description
 * Handles the OTP verification process, including checking user credentials, verifying OTP validity, generating JWT tokens, and updating the token status in the database.
 */
@Injectable()
export class VerificationOtpUseCase {
	constructor(
		private readonly helper: AuthHelper,
		private readonly repository: AuthRepository,
	) {}

	/**
	 * @method verification
	 * @description
	 * Verifies the OTP code provided by the user and processes authentication. It includes checking rate limits, OTP validity, and generating new tokens.
	 *
	 * - Retrieves the user based on the provided email.
	 * - Validates the OTP code and checks its expiration.
	 * - Generates new JWT access and refresh tokens if the OTP is valid.
	 * - Updates the OTP status and user session in the database.
	 * - Logs the authentication attempt including geolocation and user-agent information.
	 *
	 * @param {Request} req - The Express request object containing the email and OTP code in the request body.
	 * @returns {Promise<{ access_token: string, refresh_token: string }>} - Returns the new access and refresh tokens if the OTP is valid.
	 * @throws {UnauthorizedException} - Throws an exception if the OTP is invalid, expired, or user credentials are incorrect.
	 *
	 * @example
	 * const result = await verificationOtpUseCase.verification({
	 *   body: { email: 'test@example.com', otp_code: '123456' },
	 *   headers: { 'user-agent': 'Mozilla/5.0' },
	 *   ip: '192.168.0.1',
	 * });
	 */
	async verification(res: Response, req: Request): Promise<{ code: string }> {
		const { otp_code } = req.body;
		const api_key_id = res.locals.api_key_id;

		// Retrieve geolocation and user-agent information
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		// Retrieve the last OTP for the user
		const findOtp = await this.repository.findOtpByCode(
			'mfa_infos',
			TOKEN_VALID,
			otp_code,
		);

		// Check rate limiting for user login attempts
		await this.helper.checkRateLimit(findOtp.user_id);

		if (!findOtp) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check if OTP has expired
		const currentTime = new Date();
		if (findOtp && findOtp.expires_at < currentTime) {
			await this.helper.incrementFailedAttempts(findOtp.user_id); // Increment failed attempts counter
			await this.repository.updateOtp(
				'mfa_infos',
				TOKEN_INVALID,
				findOtp.mi_id,
			);
			throw new Error('OTP Expired.');
		}

		// Check if provided OTP matches the decrypted OTP
		if (otp_code !== findOtp.otp_code) {
			await this.helper.incrementFailedAttempts(findOtp.user_id); // Increment failed attempts counter
			throw new UnauthorizedException('Invalid credentials');
		}

		// Generate Code
		const code = Math.floor(100000 + Math.random() * 900000).toString();

		const expired = this.helper.addMinutesToDate(new Date(), 60); // 1 hour

		await this.repository.saveCode('auth_codes', {
			code: code,
			expires_at: expired,
			user_id: findOtp.user_id,
			api_key_id: api_key_id,
			status: TOKEN_VALID,
			ip_origin: req.ip,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		});

		// Update OTP status
		await this.repository.updateOtp(
			'mfa_infos',
			TOKEN_INVALID,
			findOtp.mi_id,
		);

		// Reset failed attempts counter
		await this.helper.resetFailedAttempts(findOtp.user_id);

		// Return the code
		return {
			code: code,
		};
	}
}
