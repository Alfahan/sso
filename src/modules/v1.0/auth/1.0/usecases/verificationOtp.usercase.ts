import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import CryptoTs from 'pii-agent-ts';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { LOGGED_IN, TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import * as geoip from 'geoip-lite'; // Library to get geolocation data
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)

/**
 * @service VerificationOtpUseCase
 * @description
 * Handles the OTP verification process, including checking user credentials, verifying OTP validity, generating JWT tokens, and updating the token status in the database.
 */
@Injectable()
export class VerificationOtpUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService, // Service to handle JWT token creation and validation
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
	async verification(
		req: Request,
	): Promise<{ access_token: string; refresh_token: string }> {
		const { email, otp_code } = req.body;
		let user = null;

		// Retrieve geolocation and user-agent information
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		// Find user by email
		if (email) {
			user = await this.repository.findByEmail('users', email);
		}

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await checkRateLimit(user.id, this.repository);

		// Retrieve the last OTP for the user
		const lastOtp = await this.repository.findLastOtp(
			'mfa_infos',
			TOKEN_VALID,
			user.id,
		);

		if (!lastOtp) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Decrypt the OTP code
		const decryptOtp = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(lastOtp.otp_code),
		);

		// Check if OTP has expired
		const currentTime = new Date();
		if (lastOtp && lastOtp.otp_expired_at < currentTime) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter
			await this.repository.updateOtp(
				'mfa_infos',
				TOKEN_INVALID,
				lastOtp.id,
			);
			throw new Error('OTP Expired.');
		}

		// Check if provided OTP matches the decrypted OTP
		if (otp_code !== decryptOtp) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter
			throw new UnauthorizedException('Invalid credentials');
		}

		// Generate new JWT tokens
		const uuid = uuidv4();
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadToken = { sub: encryptUuid.Value.toString() }; // The payload contains the user id (sub)
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '15m', // Set token expiration time to 15 minutes
		});
		const encryptId = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadRefToken = { sub: encryptId.Value.toString() };
		const newRefreshToken = this.jwtService.sign(payloadRefToken);

		// Save new session token in the database
		const tokenData = {
			id: uuid,
			user_id: user.id,
			token: newToken,
			refresh_token: newRefreshToken,
			status: LOGGED_IN,
			ip_origin: req.ip,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		};

		await this.repository.saveToken('user_sessions', tokenData);

		// Update OTP status
		await this.repository.updateOtp('mfa_infos', TOKEN_INVALID, lastOtp.id);

		// Reset failed attempts counter
		await resetFailedAttempts(user.id, this.repository);

		// Return the new tokens
		return {
			access_token: newToken,
			refresh_token: newRefreshToken,
		};
	}
}
