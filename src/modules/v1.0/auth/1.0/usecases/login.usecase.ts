import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { TooManyRequestsException } from '@app/common/api-response/interfaces/fabd-to-many-request';

@Injectable()
export class LoginUseCase {
	private readonly repository: AuthRepository;
	private readonly jwtService: JwtService;

	private failedLoginAttempts: {
		[user_id: string]: { count: number; timestamp: Date };
	} = {};

	constructor(repository: AuthRepository, jwtService: JwtService) {
		this.repository = repository;
		this.jwtService = jwtService;
	}

	async login(req: Request) {
		const { no_phone, email, password } = req.body;
		let find: any = null;

		// Retrieve user ID by email or phone
		if (email !== undefined) {
			find = await this.repository.findByEmail('users', email);
		}

		if (no_phone !== undefined) {
			find = await this.repository.findByNoPhone('users', no_phone);
		}

		// If no ID is found, throw UnauthorizedException
		if (!find) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check for rate limiting before proceeding
		this.checkRateLimit(find.id);

		// Validate the provided password
		const isValidPassword = await this.isPasswordValid(
			password,
			find.password,
		);

		if (!isValidPassword) {
			// Increment failed attempts if password is invalid
			this.incrementFailedAttempts(find.id);
			throw new UnauthorizedException('Invalid credentials');
		}

		// If rate limiting blocks login, it throws TooManyRequestsException
		const payload = { sub: find.id };

		try {
			// Generate JWT token
			const token = this.jwtService.sign(payload);

			// Save token and login logs
			const payloadToken = {
				user_id: find.id,
				token,
				status: 'valid',
			};

			await this.repository.saveToken('user_tokens', payloadToken);
			await this.repository.saveLoginLogs(
				find.id,
				req.ip,
				'Login',
				req.headers['user-agent'],
			);

			// Reset failed attempts on successful login
			this.resetFailedAttempts(find.id);

			const result = {
				access_token: token,
			};

			return result;
		} catch (error) {
			// Increment failed attempts on error
			this.incrementFailedAttempts(find.id);
			throw error;
		}
	}

	// Method to validate password using bcrypt
	private async isPasswordValid(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		// Compare the provided password with the stored hashed password
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	// Method to check rate limit
	private checkRateLimit(user_id: string): void {
		const attempt = this.failedLoginAttempts[user_id];

		// If there are recorded attempts
		if (attempt) {
			const timeSinceLastAttempt =
				(new Date().getTime() - attempt.timestamp.getTime()) / 1000;

			// If more than 5 failed attempts and within the 15 minute window
			if (attempt.count >= 5 && timeSinceLastAttempt < 15 * 60) {
				// Block login for 15 minutes
				throw new TooManyRequestsException(
					'Too many login attempts. Try again later.',
				);
			} else if (timeSinceLastAttempt >= 15 * 60) {
				// Reset attempts after cooldown period
				this.resetFailedAttempts(user_id);
			}
		}
	}

	// Method to increment failed login attempts
	async incrementFailedAttempts(user_id: string) {
		if (!this.failedLoginAttempts[user_id]) {
			this.failedLoginAttempts[user_id] = {
				count: 1,
				timestamp: new Date(),
			};
		} else {
			this.failedLoginAttempts[user_id].count++;
			this.failedLoginAttempts[user_id].timestamp = new Date();
		}
	}

	// Method to reset failed login attempts
	async resetFailedAttempts(user_id: string) {
		delete this.failedLoginAttempts[user_id];
	}
}
