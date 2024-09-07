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
import { LOGGED_IN, TOKEN_VALID } from '@app/const'; // Constants for token status
import CryptoTs from 'pii-agent-ts';
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)
import * as geoip from 'geoip-lite'; // Library to get geolocation data from IP addresses
import * as path from 'path';
import Notification from 'notif-agent-ts';
// import { checkAnomalous } from '@app/middlewares/checkAnomalous.middleware';

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

	async login(req: Request) {
		const { email, password } = req.body;
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		let user = null;

		// Find the user by email or phone number
		if (email) {
			user = await this.repository.findByEmail('users', email); // Fetch user by email
		}

		// If user is not found, throw an UnauthorizedException
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await checkRateLimit(user.id, this.repository);

		// Check for suspicious login patterns or behavior
		// await checkAnomalous(req, user.id, this.repository);

		// Validate the user's password
		const isValidPassword = await this.isPasswordValid(
			password,
			user.password,
		);

		if (!isValidPassword) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter if password is invalid
			// Log login
			// await this.repository.saveAuthHistory(
			// 	user.id,
			// 	req.ip,
			// 	'LOGIN',
			// 	req.headers['user-agent'],
			// );
			throw new UnauthorizedException('Invalid credentials');
		}

		try {
			// Check if the user already has a valid token
			const existingToken = await this.repository.cekValidateToken(
				'user_sessions',
				{
					user_id: user.id,
					ip_origin: req.ip,
					geolocation: geo
						? `${geo.city}, ${geo.region}, ${geo.country}`
						: 'Unknown',
					country: geo?.country || 'Unknown',
					browser: agent.toAgent(),
					os_type: agent.os.toString(),
					device: agent.device.toString(),
				},
			);

			if (existingToken) {
				// try {
				// Verify the existing token. Throws an error if the token is expired.
				this.jwtService.verify(existingToken.token, {
					ignoreExpiration: false,
				});

				// Log login
				// await this.repository.saveAuthHistory(
				// 	user.id,
				// 	req.ip,
				// 	'LOGIN',
				// 	req.headers['user-agent'],
				// );

				await resetFailedAttempts(user.id, this.repository);

				await this.repository.updateTokenStatus(
					'user_sessions',
					LOGGED_IN, // (logged in)
					existingToken.id,
				);

				// Return the valid token
				return {
					access_token: existingToken.token,
					refresh_token: existingToken.refresh_token,
				};
				// } catch (e) {
				// 	// If token is expired, disable it and generate a new token
				// 	if (e.name === 'TokenExpiredError') {
				// 		// Log login
				// 		// await this.repository.saveAuthHistory(
				// 		// 	user.id,
				// 		// 	req.ip,
				// 		// 	'LOGIN',
				// 		// 	req.headers['user-agent'],
				// 		// );
				// 		throw new UnauthorizedException('Token Expired');
				// 	} else {
				// 		throw e; // For other token-related errors, rethrow the exception
				// 	}
				// }
			}

			// Check if the user already has an active OTP that hasn't expired
			const lastOtp = await this.repository.findLastOtp(
				'mfa_infos',
				TOKEN_VALID,
				user.id,
			);
			const currentTime = new Date();

			// If an OTP is still active, block the request and inform the user when they can request again
			if (lastOtp && lastOtp.otp_expired_at > currentTime) {
				const timeDifference =
					(lastOtp.otp_expired_at.getTime() - currentTime.getTime()) /
					60000;
				await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts if trying too soon
				throw new Error(
					`OTP already sent. Please wait ${Math.ceil(timeDifference)} minute(s) to request again.`,
				);
			}

			// Generate a new OTP code
			const otpCode = Math.floor(
				100000 + Math.random() * 900000,
			).toString();

			// Encrypt the OTP using AES-256-CBC encryption
			const encryptOtp = CryptoTs.encryptWithAes('AES_256_CBC', otpCode);

			// Set the expiration time for the OTP to 5 minutes from now
			const otpExpired = this.addMinutesToDate(new Date(), 1);

			// Save the encrypted OTP and its expiration time to the database
			await this.repository.saveOtp('mfa_infos', {
				otp_code: encryptOtp.Value.toString(),
				otp_expired_at: otpExpired,
				user_id: user.id,
				status: TOKEN_VALID,
			});

			const mailOptions = {
				from: 'sso.fabdigital@gmail.com',
				to: [email],
				subject: 'OTP Verification',

				templatePath: path.join(
					process.cwd(),
					'assets',
					'otpVerification.html',
				),

				context: {
					otpCode: otpCode,
				},
			};

			await resetFailedAttempts(user.id, this.repository);

			Notification.sendMail(mailOptions).catch(console.error);
			// Throw an exception to indicate that OTP verification is needed
			throw new UnauthorizedException(
				'Please verify your OTP as you are logging in from a different device.',
			);
		} catch (error) {
			// Log login
			// await this.repository.saveAuthHistory(
			// 	user.id,
			// 	req.ip,
			// 	'LOGIN',
			// 	req.headers['user-agent'],
			// );
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

	/**
	 * Utility method to add a specified number of minutes to a given date.
	 *
	 * @param date - The original date to add minutes to.
	 * @param minutes - The number of minutes to add.
	 * @returns Date - The new date with the minutes added.
	 */
	private addMinutesToDate(date: Date, minutes: number): Date {
		const newDate = new Date(date.getTime() + minutes * 60000);
		return newDate;
	}
}
