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

		// Verify the refresh token (check expiration and signature)
		const jwtPayload = this.jwtService.verify(refresh_token);

		// Decrypt the session ID from the JWT payload
		const sessionId = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(jwtPayload.sub),
		);

		// Fetch the session based on the decrypted ID
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);
		const session = await this.repository.checkSessions('user_sessions', {
			id: sessionId,
			api_key_id,
			ip_origin: req.ip,
			geolocation: geo
				? `${geo.city}, ${geo.region}, ${geo.country}`
				: 'Unknown',
			country: geo?.country || 'Unknown',
			browser: agent.toAgent(),
			os_type: agent.os.toString(),
			device: agent.device.toString(),
		});

		if (!session) throw new UnauthorizedException('Invalid credentials');

		// Encrypt the session ID for the new access and refresh tokens
		const encryptedId = CryptoTs.encryptWithAes('AES_256_CBC', session.id);
		const newAccessToken = this.jwtService.sign(
			{ sub: encryptedId.Value.toString() },
			{ expiresIn: '2h' },
		);
		const newRefreshToken = this.jwtService.sign(
			{ sub: encryptedId.Value.toString() },
			{ expiresIn: '7d' },
		);

		// Update the session with the new tokens
		await this.repository.updateToken(
			'user_sessions',
			{ token: newAccessToken, refresh_token: newRefreshToken },
			session.id,
		);

		// Return the new tokens
		return {
			access_token: newAccessToken,
			refresh_token: newRefreshToken,
		};
	}
}
