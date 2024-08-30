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

@Injectable()
export class LoginUseCase {
	// Object to store failed login attempts, with user IDs as keys
	private failedLoginAttempts: {
		[user_id: string]: { count: number; timestamp: Date };
	} = {};

	constructor(
		private readonly repository: AuthRepository, // Injecting AuthRepository for interacting with the authentication data in the database
		private readonly jwtService: JwtService, // Injecting JwtService for handling JWT token creation and verification
	) {}

	async login(req: Request) {
		// Extracting phone number, email, and password from the request body
		const { no_phone, email, password } = req.body;
		let user = null;

		// Retrieve the user by either email or phone number
		if (email) {
			user = await this.repository.findByEmail('users', email); // Look up user by email in the 'users' table
		} else if (no_phone) {
			user = await this.repository.findByNoPhone('users', no_phone); // Look up user by phone number in the 'users' table
		}

		// If no user is found, throw an UnauthorizedException
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check if the user has exceeded the rate limit for failed login attempts
		checkRateLimit(user.id);

		// Validate the provided password against the stored hash
		const isValidPassword = await this.isPasswordValid(
			password,
			user.password,
		);
		if (!isValidPassword) {
			// If the password is invalid, increment the failed attempts counter
			incrementFailedAttempts(user.id);
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check for any anomalous login behavior (e.g., new location, device, or browser)
		await checkAnomalousLogin(req, user.id, this.repository);

		// Create the JWT payload with the user's ID
		const payload = { sub: user.id };

		try {
			// Generate a JWT token for the user
			const token = this.jwtService.sign(payload);

			// Save the generated token to the database and log the login event
			const tokenData = { user_id: user.id, token, status: 'valid' };
			await this.repository.saveToken('user_tokens', tokenData); // Store the token in the 'user_tokens' table
			await this.repository.saveLoginLogs(
				user.id,
				req.ip,
				'Login',
				req.headers['user-agent'],
			); // Log the login attempt in the 'login_logs' table

			// Reset the failed login attempts after a successful login
			resetFailedAttempts(user.id);

			// Return the generated JWT token in the response
			return { access_token: token };
		} catch (error) {
			// If an error occurs during token generation or logging, increment the failed attempts counter
			incrementFailedAttempts(user.id);
			throw error; // Rethrow the error after handling it
		}
	}

	// Method to validate the user's password using bcrypt
	private async isPasswordValid(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		// Compare the plain password with the hashed password stored in the database
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}
