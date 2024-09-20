import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import * as geoip from 'geoip-lite';
import * as useragent from 'useragent';
import CryptoTs from 'pii-agent-ts';
import { v4 as uuidv4 } from 'uuid';
import { LOGGED_IN, TOKEN_INVALID } from '@app/const';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class GetTokenUseCase {
	constructor(
		private readonly helper: AuthHelper,
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async getToken(
		res: Response,
		req: Request,
	): Promise<{ access_token: string; refresh_token: string }> {
		const { code } = req.body;
		const api_key_id = res.locals.api_key_id;

		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		const findCode = await this.repository.findCode('auth_codes', code);

		if (!findCode) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const currentTime = new Date();
		if (findCode && findCode.expires_at < currentTime) {
			await this.helper.incrementFailedAttempts(findCode.user_id);
			await this.repository.updateCodeStatus(
				'auth_codes',
				TOKEN_INVALID,
				findCode.ac_id,
			);
			throw new Error('Code Expired.');
		}

		// Check if the user already has a valid token
		const existingToken = await this.repository.cekValidateToken(
			'user_sessions',
			{
				user_id: findCode.user_id,
				api_key_id: api_key_id,
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
			// Verify the existing token. Throws an error if the token is expired.
			this.jwtService.verify(existingToken.token, {
				ignoreExpiration: true,
			});

			// Log login
			await this.repository.saveAuthHistory('auth_histories', {
				user_id: findCode.user_id,
				ip_origin: req.ip,
				geolocation: geo
					? `${geo.city}, ${geo.region}, ${geo.country}`
					: 'Unknown',
				country: geo?.country || 'Unknown',
				browser: agent.toAgent(),
				os_type: agent.os.toString(),
				device: agent.device.toString(),
				action: 'LOGIN',
			});

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
		}

		const uuid = uuidv4();
		const encryptUuid = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadToken = { sub: encryptUuid.Value.toString() }; // The payload contains the user id (sub)
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '15m', // Set token expiration time to 15 minutes
		});
		const encryptId = CryptoTs.encryptWithAes('AES_256_CBC', uuid);
		const payloadRefToken = { sub: encryptId.Value.toString() };
		const newRefreshToken = this.jwtService.sign(payloadRefToken, {
			expiresIn: '7d', // Set token expiration time to 7 days
		});

		const tokenData = {
			id: uuid,
			user_id: findCode.user_id,
			api_key_id: api_key_id,
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

		this.helper.sendNewLoginAlert({
			email: findCode.email,
			browser: agent.toAgent(),
			device: agent.device.toString(),
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
		});

		return {
			access_token: newToken,
			refresh_token: newRefreshToken,
		};
	}
}
