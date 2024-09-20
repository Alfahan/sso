import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import { TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import * as useragent from 'useragent';
import * as geoip from 'geoip-lite';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
	) {}

	async login(res: Response, req: Request): Promise<{ code: string }> {
		const { email, password } = req.body;
		const api_key_id = res.locals.api_key_id;

		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		let user = null;

		// Find the user by email
		if (email) {
			user = await this.repository.findByEmail('users', email); // Fetch user by email
		}

		// If user is not found, throw an UnauthorizedException
		if (!user) {
			// Log login
			await this.repository.saveAuthHistory('auth_histories', {
				user_id: user.id,
				ip_origin: req.ip,
				geolocation: geo
					? `${geo.city}, ${geo.region}, ${geo.country}`
					: 'Unknown',
				country: geo?.country || 'Unknown',
				browser: agent.toAgent(),
				os_type: agent.os.toString(),
				device: agent.device.toString(),
				action: 'LOGIN_FAILED',
			});
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await this.helper.checkRateLimit(user.id);

		// Validate the user's password
		const isValidPassword = await this.helper.isPasswordValid(
			password,
			user.password,
		);

		if (!isValidPassword) {
			await this.helper.incrementFailedAttempts(user.id); // Increment failed attempts counter if password is invalid
			// Log login
			await this.repository.saveAuthHistory('auth_histories', {
				user_id: user.id,
				ip_origin: req.ip,
				geolocation: geo
					? `${geo.city}, ${geo.region}, ${geo.country}`
					: 'Unknown',
				country: geo?.country || 'Unknown',
				browser: agent.toAgent(),
				os_type: agent.os.toString(),
				device: agent.device.toString(),
				action: 'LOGIN_FAILED',
			});
			throw new UnauthorizedException('Invalid credentials');
		}

		try {
			const currentTime = new Date();
			// Check if the user already has a valid token
			const existingCode = await this.repository.cekValidateCode(
				'auth_codes',
				{
					user_id: user.id,
					api_key_id: api_key_id,
					status: TOKEN_VALID,
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

			if (existingCode) {
				if (existingCode && existingCode.expires_at < currentTime) {
					await this.helper.incrementFailedAttempts(user.id); // Increment failed attempts counter
					await this.repository.updateCodeStatus(
						'auth_codes',
						TOKEN_INVALID,
						existingCode.id,
					);
					// Log login
					await this.repository.saveAuthHistory('auth_histories', {
						user_id: user.id,
						ip_origin: req.ip,
						geolocation: geo
							? `${geo.city}, ${geo.region}, ${geo.country}`
							: 'Unknown',
						country: geo?.country || 'Unknown',
						browser: agent.toAgent(),
						os_type: agent.os.toString(),
						device: agent.device.toString(),
						action: 'LOGIN_FAILED',
					});
					throw new Error('Code Expired.');
				}
				await this.repository.saveAuthHistory('auth_histories', {
					user_id: user.id,
					ip_origin: req.ip,
					geolocation: geo
						? `${geo.city}, ${geo.region}, ${geo.country}`
						: 'Unknown',
					country: geo?.country || 'Unknown',
					browser: agent.toAgent(),
					os_type: agent.os.toString(),
					device: agent.device.toString(),
					action: 'LOGIN_SUCCESS',
				});

				await this.helper.resetFailedAttempts(user.id);

				return {
					code: existingCode.code,
				};
			}

			// Check if the user already has an active OTP that hasn't expired
			const findOtp = await this.repository.findOtpByUserId(
				'mfa_infos',
				TOKEN_VALID,
				user.id,
			);

			// If an OTP is still active, block the request and inform the user when they can request again
			if (findOtp && findOtp.expires_at > currentTime) {
				const timeDifference =
					(findOtp.expires_at.getTime() - currentTime.getTime()) /
					60000;
				await this.helper.incrementFailedAttempts(user.id); // Increment failed attempts if trying too soon
				// Log login
				await this.repository.saveAuthHistory('auth_histories', {
					user_id: user.id,
					ip_origin: req.ip,
					geolocation: geo
						? `${geo.city}, ${geo.region}, ${geo.country}`
						: 'Unknown',
					country: geo?.country || 'Unknown',
					browser: agent.toAgent(),
					os_type: agent.os.toString(),
					device: agent.device.toString(),
					action: 'LOGIN_FAILED',
				});
				throw new Error(
					`OTP already sent. Please wait ${Math.ceil(timeDifference)} minute(s) to request again.`,
				);
			}

			// Generate a new OTP code
			const otpCode = Math.floor(
				100000 + Math.random() * 900000,
			).toString();

			// Set the expiration time for the OTP to 1 minute from now
			const otpExpired = this.helper.addMinutesToDate(new Date(), 1); // 1 minutes

			// Save the encrypted OTP and its expiration time to the database
			await this.repository.saveOtp('mfa_infos', {
				otp_code: otpCode,
				expires_at: otpExpired,
				user_id: user.id,
				status: TOKEN_VALID,
				api_key_id: api_key_id,
			});

			this.helper.sendOtpVerification(email, otpCode);

			await this.helper.resetFailedAttempts(user.id);

			// Throw an exception to indicate that OTP verification is needed
			throw new UnauthorizedException(
				'Please verify your OTP as you are logging in from a different device.',
			);
		} catch (error) {
			// Log login
			await this.repository.saveAuthHistory('auth_histories', {
				user_id: user.id,
				ip_origin: req.ip,
				geolocation: geo
					? `${geo.city}, ${geo.region}, ${geo.country}`
					: 'Unknown',
				country: geo?.country || 'Unknown',
				browser: agent.toAgent(),
				os_type: agent.os.toString(),
				device: agent.device.toString(),
				action: 'LOGIN_FAILED',
			});
			throw error; // Rethrow the exception
		}
	}
}
