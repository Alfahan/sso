import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import CryptoTs from 'pii-agent-ts';
import * as geoip from 'geoip-lite';
import * as useragent from 'useragent';

@Injectable()
export class RefreshTokenUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async refreshToken(res: Response, req: Request) {
		const { refresh_token } = req.params;
		const api_key_id = res.locals.api_key_id;

		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);

		// Verify the refresh token without checking expiration
		const jwt = this.jwtService.verify(refresh_token, {
			ignoreExpiration: false,
		});

		// Decrypt the user session ID from the JWT payload
		const user_session_id = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(jwt.sub),
		);

		// Check if a session with the decrypted ID exists
		const existingSession = await this.repository.checkSessions(
			'user_sessions',
			{
				id: user_session_id,
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

		if (!existingSession) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (existingSession) {
			// Encrypt the session ID for the new access token payload
			const encryptUuid = CryptoTs.encryptWithAes(
				'AES_256_CBC',
				existingSession.id,
			);

			// Generate a new access token
			const payloadToken = { sub: encryptUuid.Value.toString() };
			const newToken = this.jwtService.sign(payloadToken, {
				expiresIn: '2h', // Set token expiration time to 2 hours
			});

			// Encrypt the session ID for the new refresh token payload
			const encryptId = CryptoTs.encryptWithAes(
				'AES_256_CBC',
				existingSession.id,
			);
			const payloadRefToken = { sub: encryptId.Value.toString() };
			const newRefreshToken = this.jwtService.sign(payloadRefToken, {
				expiresIn: '7d', // Set token expiration time to 7 days
			});

			// Update the session in the database with the new tokens
			await this.repository.updateToken(
				'user_sessions',
				{
					token: newToken,
					refresh_token: newRefreshToken,
				},
				existingSession.id,
			);

			// Return the new access and refresh tokens
			return {
				access_token: newToken,
				refresh_token: newRefreshToken,
			};
		}

		throw new UnauthorizedException('Invalid credentials');
	}
}
