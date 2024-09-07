import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import CryptoTs from 'pii-agent-ts';

@Injectable()
export class RefreshTokenUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly jwtService: JwtService,
	) {}

	async refreshToken(req: Request) {
		const { refresh_token } = req.params;

		const jwt = this.jwtService.verify(refresh_token, {
			ignoreExpiration: true,
		});

		const user_session_id = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(jwt.sub),
		);

		const existingSession = await this.repository.checkSessions(
			'user_sessions',
			user_session_id,
		);

		const encryptUuid = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			existingSession.id,
		);

		const payloadToken = { sub: encryptUuid.Value.toString() };
		const newToken = this.jwtService.sign(payloadToken, {
			expiresIn: '2h', // Set token expiration time to 2 hours
		});
		const encryptId = CryptoTs.encryptWithAes(
			'AES_256_CBC',
			existingSession.id,
		);
		const payloadRefToken = { sub: encryptId.Value.toString() };
		const newRefreshToken = this.jwtService.sign(payloadRefToken);

		await this.repository.updateToken(
			'user_sessions',
			{
				token: newToken,
				refresh_token: newRefreshToken,
			},
			existingSession.id,
		);

		return {
			access_token: newToken,
			refresh_token: newRefreshToken,
		};
	}
}
