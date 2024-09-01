import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository'; // Repository for database access related to authentication
import { JwtService } from '@nestjs/jwt'; // Service for handling JWT token creation and verification
import { Request } from 'express'; // Express request type for handling HTTP requests
import * as bcrypt from 'bcrypt'; // bcrypt library for hashing and comparing passwords
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import { checkAnomalousLogin } from '@app/middlewares/checkAnomalousLogin.middleware';
import { TOKEN_VALID } from '@app/const';

/**
 * @service LoginUseCase
 * @description
 * This service handles user login, including authentication and token generation.
 */
@Injectable()
export class LoginUseCase {
	constructor(
		private readonly repository: AuthRepository, // Injecting AuthRepository for interacting with the authentication data in the database
		private readonly jwtService: JwtService, // Injecting JwtService for handling JWT token creation and verification
	) {}

	/**
	 * @method login
	 * @description
	 * Handles user login by validating credentials, generating a JWT token, and logging the login activity.
	 *
	 * @param {Request} req - The Express request object containing login details.
	 * @returns {Promise<{ access_token: string }>} - Returns an object containing the generated JWT token if login is successful.
	 * @throws {UnauthorizedException} - Throws an exception if the credentials are invalid or other errors occur.
	 *
	 * @example
	 * const result = await loginUseCase.login({
	 *   body: { no_phone: '1234567890', password: 'password123' },
	 *   ip: '192.168.1.1',
	 *   headers: { 'user-agent': 'Mozilla/5.0' },
	 * });
	 */
	async login(req: Request) {
		const { no_phone, email, password } = req.body;
		let user = null;

		if (email) {
			user = await this.repository.findByEmail('users', email); // Look up user by email
		} else if (no_phone) {
			user = await this.repository.findByNoPhone('users', no_phone); // Look up user by phone number
		}

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		checkRateLimit(user.id); // Check if the user has exceeded the rate limit

		const isValidPassword = await this.isPasswordValid(
			password,
			user.password,
		);
		if (!isValidPassword) {
			incrementFailedAttempts(user.id); // Increment failed attempts counter
			throw new UnauthorizedException('Invalid credentials');
		}

		await checkAnomalousLogin(req, user.id, this.repository); // Check for anomalous login behavior

		try {
			const cekToken = await this.repository.cekValidateToken(
				'user_tokens',
				{ id: user.id, status: TOKEN_VALID },
			);

			if (cekToken) {
				await this.repository.saveActivityLogs(
					user.id,
					req.ip,
					'LOGIN',
					req.headers['user-agent'],
				); // Log successful login attempt

				return { access_token: cekToken }; // Return existing valid token
			}

			const payload = { sub: user.id };
			const token = this.jwtService.sign(payload); // Generate a new JWT token

			const tokenData = { user_id: user.id, token, status: TOKEN_VALID };
			await this.repository.saveToken('user_tokens', tokenData); // Save the new token to the database
			await this.repository.saveActivityLogs(
				user.id,
				req.ip,
				'LOGIN',
				req.headers['user-agent'],
			); // Log successful login attempt

			resetFailedAttempts(user.id); // Reset failed attempts counter after successful login

			return { access_token: token }; // Return the newly generated JWT token
		} catch (error) {
			incrementFailedAttempts(user.id); // Increment failed attempts counter if an error occurs
			throw error; // Rethrow the error
		}
	}

	/**
	 * @method isPasswordValid
	 * @description
	 * Validates a plain password against a hashed password using bcrypt.
	 *
	 * @param {string} plainPassword - The plain text password to be validated.
	 * @param {string} hashedPassword - The hashed password to compare against.
	 * @returns {Promise<boolean>} - Returns true if the password is valid, otherwise false.
	 *
	 * @example
	 * const isValid = await loginUseCase.isPasswordValid('password123', 'hashedPassword');
	 */
	private async isPasswordValid(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}
