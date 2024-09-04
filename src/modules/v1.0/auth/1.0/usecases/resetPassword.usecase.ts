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
		const existingToken = await this.repository.cekValidateToken(
			'user_reset_passwords',
			{
				user_id: user_id,
				status: TOKEN_VALID,
			},
		);

		// If a valid token exists, proceed with the password reset process
		if (existingToken) {
			try {
				let user = null;

				// Fetch the user by their ID
				if (user_id) {
					user = await this.repository.findById('users', user_id);
				}

				// If user is not found, throw an UnauthorizedException
				if (!user) {
					throw new UnauthorizedException('Invalid credentials');
				}

				// Hash the new password using bcrypt with a salt factor of 10
				const hashedPassword = await bcrypt.hash(new_password, 10);

				// Update the user's password in the database
				const result = await this.repository.resetPassword('users', {
					id: user_id,
					password: hashedPassword,
				});

				// Invalidate the used reset password token
				await this.repository.updateTokenStatus(
					'user_reset_passwords',
					token,
					TOKEN_INVALID,
				);

				// Log successful
				await this.repository.saveAuthHistory(
					user_id,
					req.ip,
					'RESET_PASSWORD',
					req.headers['user-agent'],
				);

				return result;
			} catch (e) {
				// Handle token expiration error
				if (e.name === 'TokenExpiredError') {
					await this.repository.updateTokenStatus(
						'user_reset_passwords',
						token,
						TOKEN_INVALID,
					);
					throw new UnauthorizedException('Token Expired');
				} else {
					throw e; // Rethrow other errors
				}
			}
		}

		// If the token is invalid, throw an UnauthorizedException
		throw new UnauthorizedException('Token Expired');
	}
}
