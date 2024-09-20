import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';
import { LOGGED_IN, TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import * as geoip from 'geoip-lite'; // Library to get geolocation data
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)
import { AuthHelper } from '../auth.helper';

@Injectable()
export class LoginPhoneUseCase {
	constructor(
		private readonly helper: AuthHelper,
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService, // Service to handle JWT token creation and validation
	) {}

	/**
	 * Handles the phone login process using OTP and JWT token.
	 * This method performs the following steps:
	 * 1. Validates the OTP provided by the user.
	 * 2. Checks for rate limiting to prevent excessive login attempts.
	 * 3. Manages token issuance, including the generation of new tokens and updating existing tokens.
	 * 4. Updates the status of the OTP and logs relevant information.
	 *
	 * @param {Request} req - The Express request object containing the phone number and OTP code in the request body.
	 * @returns {Promise<{ access_token: string; refresh_token: string | null }>} - Returns an object containing the JWT access token and refresh token if login is successful.
	 * @throws {UnauthorizedException} - Throws if the user credentials or OTP are invalid.
	 * @throws {Error} - Throws if OTP is expired or any other error occurs during the login process.
	 */
	async login(
		req: Request,
	): Promise<{ access_token: string; refresh_token: string | null }> {
		const { phone_number, otp_code } = req.body;
		let user = null;

		// Retrieve geolocation and user agent data
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		// Find the user by phone number
		if (phone_number) {
			user = await this.repository.findByPhoneNumber(
				'users',
				phone_number,
			);
		}

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await this.helper.checkRateLimit(user.id);

		// Find the last valid OTP for the user
		const lastOtp = await this.repository.findOtpByUserId(
			'mfa_infos',
			TOKEN_VALID,
			user.id,
		);

		if (!lastOtp) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Decrypt the OTP code
		const decryptOtp = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(lastOtp.otp_code),
		);

		const currentTime = new Date();

		// Check if OTP has expired
		if (lastOtp.expires_at < currentTime) {
			await this.helper.incrementFailedAttempts(user.id); // Increment failed attempts counter if OTP is expired
			await this.repository.updateOtp(
				'mfa_infos',
				TOKEN_INVALID,
				lastOtp.id,
			);
			throw new Error('OTP Expired.');
		}

		// Validate the provided OTP code
		if (otp_code !== decryptOtp) {
			await this.helper.incrementFailedAttempts(user.id); // Increment failed attempts counter if OTP is invalid
			throw new UnauthorizedException('Invalid credentials');
		}

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
			try {
				// Verify the existing token
				this.jwtService.verify(existingToken.token, {
					ignoreExpiration: false,
				});

				// Reset failed attempts and return the existing token
				await this.helper.resetFailedAttempts(user.id);

				return {
					access_token: existingToken.token,
					refresh_token: existingToken.refresh_token,
				};
			} catch (e) {
				// If the token is expired, generate a new token
				if (e.name === 'TokenExpiredError') {
					const encryptUuid = CryptoTs.encryptWithAes(
						'AES_256_CBC',
						existingToken.id,
					);

					const payloadToken = { sub: encryptUuid.Value.toString() };
					const newToken = this.jwtService.sign(payloadToken, {
						expiresIn: '2h', // Set token expiration time to 2 hours
					});
					const encryptId = CryptoTs.encryptWithAes(
						'AES_256_CBC',
						existingToken.id,
					);
					const payloadRefToken = { sub: encryptId.Value.toString() };
					const newRefreshToken =
						this.jwtService.sign(payloadRefToken);

					await this.repository.updateToken(
						'user_sessions',
						{
							token: newToken,
							refresh_token: newRefreshToken,
						},
						existingToken.id,
					);

					return {
						access_token: newToken,
						refresh_token: newRefreshToken,
					};
				}
			}
		}

		// Generate a new token if no valid token exists
		const uuid = uuidv4();
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadToken = { sub: encryptUuid.Value.toString() };
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '15m', // Set token expiration time to 15 minutes
		});
		const encryptId = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadRefToken = { sub: encryptId.Value.toString() };
		const newRefreshToken = this.jwtService.sign(payloadRefToken, {
			expiresIn: '7d', // Set token expiration time to 7 days
		});

		// Save the new token in the database
		const tokenData = {
			id: uuid,
			user_id: user.id,
			token: newToken,
			refresh_token: newRefreshToken,
			status: LOGGED_IN,
			ip_origin: req.ip,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		};

		await this.repository.saveToken('user_sessions', tokenData);

		// Invalidate the used OTP
		await this.repository.updateOtp('mfa_infos', TOKEN_INVALID, lastOtp.id);

		// Reset failed attempts counter and return new tokens
		await this.helper.resetFailedAttempts(user.id);

		return {
			access_token: newToken,
			refresh_token: newRefreshToken,
		};
	}
}
