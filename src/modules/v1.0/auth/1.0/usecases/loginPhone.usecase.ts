import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import CryptoTs from 'pii-agent-ts';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginPhoneUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService, // Service to handle JWT token creation and validation
	) {}

	/**
	 * Handles the phone login process using OTP and JWT token.
	 * Validates the OTP, checks for rate limiting, and manages token issuance and authentication history.
	 *
	 * @param {Request} req - The Express request object containing the phone number and OTP in the request body.
	 * @returns {Promise<{ access_token: string; refresh_token: string | null }>} - Returns a valid JWT access token if login is successful.
	 * @throws {UnauthorizedException} - Throws if the user credentials or OTP are invalid.
	 * @throws {Error} - Throws if OTP is expired or any other error occurs during the login process.
	 */
	async login(
		req: Request,
	): Promise<{ access_token: string; refresh_token: string | null }> {
		const { phone_number, otp_code } = req.body;
		let user = null;

		if (phone_number) {
			user = await this.repository.findByPhoneNumber(
				'users',
				phone_number,
			);
		}

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await checkRateLimit(user.id, this.repository);

		const lastOtp = await this.repository.findLastOtp('mfa_infos', user.id);

		const decryptOtp = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(lastOtp.otp_code),
		);

		const currentTime = new Date();

		if (lastOtp && lastOtp.otp_expired_at < currentTime) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter if OTP is invalid
			await this.repository.saveAuthHistory(
				user.id,
				req.ip,
				'LOGIN',
				req.headers['user-agent'],
			);
			throw new Error(`OTP Expired.`);
		}

		if (otp_code !== decryptOtp) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter if OTP is invalid
			await this.repository.saveAuthHistory(
				user.id,
				req.ip,
				'LOGIN',
				req.headers['user-agent'],
			);
			throw new UnauthorizedException('Invalid credentials');
		}

		try {
			// Check if the user already has a valid token
			const existingToken = await this.repository.cekValidateToken(
				'user_tokens',
				{
					user_id: user.id,
					status: TOKEN_VALID,
				},
			);

			// If a valid token is found, check for expiration
			if (existingToken) {
				try {
					// Verify the existing token. Throws an error if the token is expired.
					this.jwtService.verify(existingToken, {
						ignoreExpiration: false,
					});

					// Log login
					await this.repository.saveAuthHistory(
						user.id,
						req.ip,
						'LOGIN',
						req.headers['user-agent'],
					);

					// Return the valid token
					return {
						access_token: existingToken,
						refresh_token: null,
					};
				} catch (e) {
					// If token is expired, disable it and generate a new token
					if (e.name === 'TokenExpiredError') {
						await this.repository.updateTokenStatus(
							'user_tokens',
							existingToken,
							TOKEN_INVALID,
						);
						// Log login
						await this.repository.saveAuthHistory(
							user.id,
							req.ip,
							'LOGIN',
							req.headers['user-agent'],
						);
					} else {
						throw e; // For other token-related errors, rethrow the exception
					}
				}
			}

			// Generate a new JWT token if no valid token exists or if the token has expired
			const uniqueId = CryptoTs.encryptWithAes('AES_256_CBC', user.id);
			const payload = { sub: uniqueId.Value.toString() }; // The payload contains the user id (sub)
			const newToken = this.jwtService.sign(payload); // Create a new JWT token

			// Save the new token in the database
			const tokenData = {
				user_id: user.id,
				token: newToken,
				status: TOKEN_VALID,
			};
			await this.repository.saveToken('user_tokens', tokenData);

			// Log login
			await this.repository.saveAuthHistory(
				user.id,
				req.ip,
				'LOGIN',
				req.headers['user-agent'],
			);

			// Reset the failed login attempts after successful login
			await resetFailedAttempts(user.id, this.repository);

			// Return the new token to the user
			return {
				access_token: newToken,
				refresh_token: null,
			};
		} catch (error) {
			// Log login
			await this.repository.saveAuthHistory(
				user.id,
				req.ip,
				'LOGIN',
				req.headers['user-agent'],
			);
			// Increment failed login attempts counter on errors
			await incrementFailedAttempts(user.id, this.repository);
			throw error; // Rethrow the exception
		}
	}
}
