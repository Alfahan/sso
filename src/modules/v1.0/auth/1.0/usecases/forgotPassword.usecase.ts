import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import { Request } from 'express';
import { checkAnomalous } from '@app/middlewares/checkAnomalous.middleware';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import { JwtService } from '@nestjs/jwt';
import CryptoTs from 'pii-agent-ts';

@Injectable()
export class ForgotPasswordUseCase {
	/**
	 * Service for handling forgot password flow, including
	 * generating JWT tokens for password reset and checking for
	 * any anomalies or rate limits on user requests.
	 *
	 * @param {AuthRepository} repository - Repository handling user data and tokens.
	 * @param {JwtService} jwtService - Service for JWT operations (signing and verifying tokens).
	 */
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Handles the forgot password process by:
	 * - Finding the user by email or phone number.
	 * - Checking rate limits for the user's requests.
	 * - Verifying whether the user has an active reset token and checking its validity.
	 * - Generating a new reset token if no valid one exists.
	 * - Logging activities such as successful or failed attempts.
	 *
	 * @param {Request} req - The incoming HTTP request containing user email or phone number.
	 * @returns {Promise<{ reset_token: string }>} - The reset token to be returned to the user.
	 * @throws Will throw an error if any step fails, including rate limiting, token validation, or user identification.
	 */
	async forgotPassword(req: Request): Promise<{ reset_token: string }> {
		// Extract email and phone number from the request body
		const { no_phone, email } = req.body;
		let user = null;

		// Find the user by email or phone number
		if (email) {
			user = await this.repository.findByEmail('users', email); // Fetch user by email
		} else if (no_phone) {
			user = await this.repository.findByPhoneNumber('users', no_phone); // Fetch user by phone number
		}

		// Check rate limiting for user login attempts
		await checkRateLimit(user.id, this.repository);

		// Check for suspicious behavior or anomalies in the request
		await checkAnomalous(req, user.id, this.repository);

		try {
			// Check if the user already has a valid token
			const existingTokenReset = await this.repository.cekValidateToken(
				'user_reset_passwords',
				{
					user_id: user.id,
					status: TOKEN_VALID,
				},
			);

			if (existingTokenReset) {
				try {
					// Verify if the existing token is still valid (not expired)
					this.jwtService.verify(existingTokenReset, {
						ignoreExpiration: false,
					});

					// Log
					await this.repository.saveAuthHistory(
						user.id,
						req.ip,
						'FORGOT_PASSWORD',
						req.headers['user-agent'],
					);

					// Return the valid reset token to the user
					return { reset_token: existingTokenReset };
				} catch (e) {
					// Handle token expiration errors
					if (e.name === 'TokenExpiredError') {
						// Mark the token as invalid if it has expired
						await this.repository.updateTokenStatus(
							'user_reset_passwords',
							existingTokenReset,
							TOKEN_INVALID,
						);
						// Log
						await this.repository.saveAuthHistory(
							user.id,
							req.ip,
							'FORGOT_PASSWORD',
							req.headers['user-agent'],
						);
					} else {
						// Rethrow the exception for other token-related errors
						throw e;
					}
				}
			}

			// If no valid token exists or if the token has expired, generate a new JWT token
			const uniqueId = CryptoTs.encryptWithAes('AES_256_CBC', user.id);
			const payload = { sub: uniqueId.Value.toString() }; // Payload contains the user id (sub)
			const newToken = this.jwtService.sign(payload); // Create the new JWT token

			// Save the new token in the database
			const tokenData = {
				user_id: user.id,
				token: newToken,
				status: TOKEN_VALID,
			};
			await this.repository.saveToken('user_reset_passwords', tokenData);

			// Log the successful password reset request
			await this.repository.saveAuthHistory(
				user.id,
				req.ip,
				'FORGOT_PASSWORD',
				req.headers['user-agent'],
			);

			// Reset the failed login attempts after a successful request
			await resetFailedAttempts(user.id, this.repository);

			// Return the new reset token to the user
			return { reset_token: newToken };
		} catch (error) {
			// If an error occurs, increment the failed login attempts counter
			await incrementFailedAttempts(user.id, this.repository);

			// Log
			await this.repository.saveAuthHistory(
				user.id,
				req.ip,
				'FORGOT_PASSWORD',
				req.headers['user-agent'],
			);
			throw error; // Rethrow the exception
		}
	}
}
