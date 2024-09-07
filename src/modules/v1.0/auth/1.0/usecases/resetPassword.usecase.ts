import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';
import * as bcrypt from 'bcrypt'; // Importing bcrypt for hashing the password
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';

/**
 * @service ResetPasswordUseCase
 * @description
 * Handles the password reset process by verifying the reset token, validating the new password, and updating the user's password in the database.
 */
@Injectable()
export class ResetPasswordUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * @method resetPassword
	 * @description
	 * Resets the user's password using a provided reset token and new password. The process includes:
	 * 1. Verifying the JWT reset token to ensure it is valid and not expired.
	 * 2. Decrypting the user ID from the token.
	 * 3. Checking if the user has a valid reset password token.
	 * 4. Hashing the new password using bcrypt.
	 * 5. Updating the user's password in the database.
	 * 6. Invalidating the used reset password token.
	 *
	 * @param {Request} req - The HTTP request object containing the reset token in the URL parameters and the new password in the request body.
	 * @returns {Promise<any>} - Returns the result of the password reset operation, typically an acknowledgment of the update.
	 * @throws {UnauthorizedException} - Throws an exception if the token is invalid, expired, or if the user is not found in the database.
	 *
	 * @example
	 * const result = await resetPasswordUseCase.resetPassword({
	 *   params: { token: 'valid-reset-token' },
	 *   body: { new_password: 'newSecurePassword123' },
	 * });
	 * // result will contain the acknowledgment of the password reset operation
	 */
	async resetPassword(req: Request): Promise<any> {
		const { token } = req.params;
		const { new_password } = req.body;

		// Verify the JWT token, checking if it is valid and not expired
		const jwt = this.jwtService.verify(token, {
			ignoreExpiration: false,
		});

		// Decrypt the user ID using AES 256 CBC encryption
		const user_id = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(jwt.sub),
		);

		// Check if the user has a valid reset password token
		const existingToken =
			await this.repository.checkTokenUserResetPassByUserId(
				'user_reset_passwords',
				{
					user_id: user_id,
					status: TOKEN_VALID,
				},
			);

		// If a valid token exists, proceed with the password reset process
		if (existingToken) {
			// Hash the new password using bcrypt with a salt factor of 10
			const hashedPassword = await bcrypt.hash(new_password, 10);

			// Update the user's password in the database
			const result = await this.repository.resetPassword('users', {
				id: user_id,
				password: hashedPassword,
			});

			// Invalidate the used reset password token
			await this.repository.updateTokenResetPass(
				'user_reset_passwords',
				TOKEN_INVALID,
				user_id,
			);

			// Log successful
			// await this.repository.saveAuthHistory(
			// 	user_id,
			// 	req.ip,
			// 	'RESET_PASSWORD',
			// 	req.headers['user-agent'],
			// );

			return result;
		}

		await this.repository.updateTokenResetPass(
			'user_reset_passwords',
			TOKEN_INVALID,
			user_id,
		);

		// If the token is invalid, throw an UnauthorizedException
		throw new UnauthorizedException('Invalid credentials');
	}
}
