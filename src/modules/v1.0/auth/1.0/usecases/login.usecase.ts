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
import { TOKEN_VALID, TOKEN_INVALID } from '@app/const'; // Constants for token status
import CryptoTs from 'pii-agent-ts';
import { checkAnomalous } from '@app/middlewares/checkAnomalous.middleware';

/**
 * The `LoginUseCase` class provides a service for handling user authentication.
 * It manages the login flow, including checking user credentials, applying rate limiting,
 * handling token verification or generation, and logging activities.
 */
@Injectable()
export class LoginUseCase {
	constructor(
		private readonly repository: AuthRepository, // Repository to handle authentication data in the database
		private readonly jwtService: JwtService, // Service to handle JWT token creation and validation
	) {}

	/**
	 * This method manages the login process for users by validating credentials and returning a JWT token.
	 *
	 * Steps:
	 * 1. It checks whether the user exists by looking up the email or phone number in the database.
	 * 2. If the user is found, it validates the provided password against the stored hashed password.
	 * 3. It checks rate limiting and anomalous behavior.
	 * 4. It handles the logic for existing valid JWT tokens (validity, expiration, regeneration).
	 * 5. If no valid token exists, it generates a new JWT token and saves it to the database.
	 * 6. It logs the login attempt (success or failure) and resets or increments login attempt counts.
	 *
	 * @param req - The incoming request containing login data (email, phone number, and password).
	 * @returns An object containing the JWT token if login is successful.
	 * @throws UnauthorizedException - Throws if the credentials are invalid or any suspicious behavior is detected.
	 */
	async login(req: Request) {
		const { no_phone, email, password } = req.body;
		let user = null;

		// Find the user by email or phone number
		if (email) {
			user = await this.repository.findByEmail('users', email); // Fetch user by email
		} else if (no_phone) {
			user = await this.repository.findByPhoneNumber('users', no_phone); // Fetch user by phone number
		}

		// If user is not found, throw an UnauthorizedException
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await checkRateLimit(user.id, this.repository);

		// Check for suspicious login patterns or behavior
		await checkAnomalous(req, user.id, this.repository);

		// Validate the user's password
		const isValidPassword = await this.isPasswordValid(
			password,
			user.password,
		);
		if (!isValidPassword) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter if password is invalid
			// Log login
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

	/**
	 * Validates the given plain password against the hashed password stored in the database.
	 *
	 * @param plainPassword - The plain password provided by the user.
	 * @param hashedPassword - The hashed password stored in the database.
	 * @returns A boolean indicating whether the password is valid.
	 */
	private async isPasswordValid(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}
