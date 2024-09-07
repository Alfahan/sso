import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';
import * as bcrypt from 'bcrypt'; // Importing bcrypt for hashing the password
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';

@Injectable()
export class ResetPasswordUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	/**
	 * Resets the user's password.
	 *
	 * @param {Request} req - The HTTP request object containing token and new password.
	 * @returns {Promise<any>} - A promise that resolves to the result of the password reset.
	 * @throws {UnauthorizedException} - If the token is invalid, expired, or the user is not found.
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
