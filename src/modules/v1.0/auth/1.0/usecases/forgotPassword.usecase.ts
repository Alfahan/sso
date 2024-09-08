import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
// import { checkAnomalous } from '@app/middlewares/checkAnomalous.middleware';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import { JwtService } from '@nestjs/jwt';
import CryptoTs from 'pii-agent-ts';

@Injectable()
export class ForgotPasswordUseCase {
	/**
	 * Service for handling the forgot password process, including:
	 * - Validating user credentials (email or phone).
	 * - Managing the creation and validation of reset tokens.
	 * - Logging reset password attempts and managing token expiration.
	 *
	 * @param {AuthRepository} repository - Repository for handling user data and tokens.
	 * @param {JwtService} jwtService - Service for handling JWT operations (signing and verifying tokens).
	 */
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Handles the forgot password flow:
	 * - Finds the user by their email or phone number.
	 * - Checks if the user has a valid reset token and returns it if valid.
	 * - Generates a new reset token if no valid token exists or if the token has expired.
	 * - Logs the attempt and handles any invalid or expired tokens.
	 *
	 * @param {Request} req - The incoming HTTP request containing user information (email or phone number).
	 * @returns {Promise<{ reset_token: string }>} - The reset token returned to the user.
	 * @throws {UnauthorizedException} - Throws if the user is not found or credentials are invalid.
	 */
	async forgotPassword(req: Request): Promise<{ reset_token: string }> {
		// Extract email and phone number from the request body
		const { email } = req.body;

		let user = null;

		// Find the user by email
		if (email) {
			user = await this.repository.findByEmail('users', email); // Fetch user by email
		}

		// If user is not found, throw an UnauthorizedException
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check if the user already has a valid reset token
		const existingTokenUserResetPass =
			await this.repository.checkTokenUserResetPassByUserId(
				'user_reset_passwords',
				{
					user_id: user.id,
					status: TOKEN_VALID,
				},
			);

		if (existingTokenUserResetPass) {
			try {
				// Verify the existing reset token
				this.jwtService.verify(existingTokenUserResetPass.token, {
					ignoreExpiration: false,
				});

				// Return the valid reset token
				return { reset_token: existingTokenUserResetPass.token };
			} catch (e) {
				// Handle token expiration
				if (e.name === 'TokenExpiredError') {
					// Update token status to invalid if it has expired
					await this.repository.updateTokenResetPass(
						'user_reset_passwords',
						TOKEN_INVALID,
						user.id,
					);
				}
			}
		}

		// If no valid token exists or the token has expired, generate a new token
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', user.id);
		const payloadToken = { sub: encryptUuid.Value.toString() }; // Create a payload with the user id (sub)
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '2m', // Set token expiration time to 2 minutes
		}); // Create a new JWT token

		// Save the new reset token in the database
		const tokenData = {
			user_id: user.id,
			token: newToken,
			status: TOKEN_VALID,
		};

		await this.repository.saveTokenUserResetPass(
			'user_reset_passwords',
			tokenData,
		);

		// Log the password reset request (optional)
		// await this.repository.saveAuthHistory(
		// 	user.id,
		// 	req.ip,
		// 	'FORGOT_PASSWORD',
		// 	req.headers['user-agent'],
		// );

		// Return the new reset token to the user
		return { reset_token: newToken };
	}
}
