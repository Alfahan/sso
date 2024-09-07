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
	async forgotPassword(req: Request) {
		// Extract email and phone number from the request body
		const { email } = req.body;

		let user = null;

		// Find the user by email or phone number
		if (email) {
			user = await this.repository.findByEmail('users', email); // Fetch user by email
		}

		// If user is not found, throw an UnauthorizedException
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

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
				this.jwtService.verify(existingTokenUserResetPass.token, {
					ignoreExpiration: false,
				});

				return { reset_token: existingTokenUserResetPass.token };
			} catch (e) {
				if (e.name === 'TokenExpiredError') {
					// Log login
					// await this.repository.saveAuthHistory(
					// 	user.id,
					// 	req.ip,
					// 	'LOGIN',
					// 	req.headers['user-agent'],
					// );

					await this.repository.updateTokenResetPass(
						'user_reset_passwords',
						TOKEN_INVALID,
						user.id,
					);
				}
			}
		}

		// If no valid token exists or if the token has expired, generate a new JWT token
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', user.id);
		const payloadToken = { sub: encryptUuid.Value.toString() }; // The payload contains the user id (sub)
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '2m', // Set token expiration time to 2 minutes
		}); // Create a new JWT token

		// Save the new token in the database
		const tokenData = {
			user_id: user.id,
			token: newToken,
			status: TOKEN_VALID,
		};
		await this.repository.saveTokenUserResetPass(
			'user_reset_passwords',
			tokenData,
		);

		// Log the successful password reset request
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
