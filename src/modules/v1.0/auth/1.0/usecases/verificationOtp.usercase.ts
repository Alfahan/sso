import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request } from 'express';
import {
	checkRateLimit,
	incrementFailedAttempts,
	resetFailedAttempts,
} from '@app/middlewares/checkRateLimit.middleware';
import CryptoTs from 'pii-agent-ts';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { LOGGED_IN, TOKEN_INVALID, TOKEN_VALID } from '@app/const';
import * as geoip from 'geoip-lite'; // Library to get geolocation data
import * as useragent from 'useragent'; // Library to parse and identify user agent (e.g., browser, OS)

@Injectable()
export class VerificationOtpUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService, // Service to handle JWT token creation and validation
	) {}

	async verification(req: Request) {
		const { email, otp_code } = req.body;
		let user = null;

		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		if (email) {
			user = await this.repository.findByEmail('users', email);
		}

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Check rate limiting for user login attempts
		await checkRateLimit(user.id, this.repository);

		const lastOtp = await this.repository.findLastOtp(
			'mfa_infos',
			TOKEN_VALID,
			user.id,
		);

		if (!lastOtp) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const decryptOtp = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(lastOtp.otp_code),
		);

		const currentTime = new Date();
		if (lastOtp && lastOtp.otp_expired_at < currentTime) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter if OTP is invalid
			// await this.repository.saveAuthHistory(
			// 	user.id,
			// 	req.ip,
			// 	'LOGIN',
			// 	req.headers['user-agent'],
			// );
			await this.repository.updateOtp(
				'mfa_infos',
				TOKEN_INVALID,
				lastOtp.id,
			);
			throw new Error(`OTP Expired.`);
		}

		if (otp_code !== decryptOtp) {
			await incrementFailedAttempts(user.id, this.repository); // Increment failed attempts counter if OTP is invalid
			// await this.repository.saveAuthHistory(
			// 	user.id,
			// 	req.ip,
			// 	'LOGIN',
			// 	req.headers['user-agent'],
			// );
			throw new UnauthorizedException('Invalid credentials');
		}

		// Generate a new JWT token if no valid token exists or if the token has expired

		const uuid = uuidv4();
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadToken = { sub: encryptUuid.Value.toString() }; // The payload contains the user id (sub)
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '15m', // Set token expiration time to 2 hours
		}); // Create a new JWT token
		const encryptId = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadRefToken = { sub: encryptId.Value.toString() };
		const newRefreshToken = this.jwtService.sign(payloadRefToken);

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

		// Log login
		// await this.repository.saveAuthHistory(
		//   user.id,
		//   req.ip,
		//   'LOGIN',
		//   req.headers['user-agent'],
		// );

		await this.repository.updateOtp('mfa_infos', TOKEN_INVALID, lastOtp.id);

		await resetFailedAttempts(user.id, this.repository);

		// Return the new token to the user

		return {
			access_token: newToken,
			refresh_token: newRefreshToken,
		};
	}
}
