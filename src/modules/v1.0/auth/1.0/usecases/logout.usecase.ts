import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LOGGED_OUT } from '@app/const';
import CryptoTs from 'pii-agent-ts';
import { AuthHelper } from '../auth.helper';

@Injectable()
export class LogoutUseCase {
	constructor(
		private readonly repository: AuthRepository,
		private readonly helper: AuthHelper,
		private readonly jwtService: JwtService,
	) {}

	async logout(res: Response, req: Request): Promise<void> {
		const authHeader = req.headers.authorization;
		const api_key_id = res.locals.api_key_id;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('No token provided');
		}

		const token = authHeader.split(' ')[1];

		const payload = this.jwtService.verify(token, {
			ignoreExpiration: true,
		});
		const id = CryptoTs.decryptWithAes(
			'AES_256_CBC',
			Buffer.from(payload.sub),
		);

		const findSession = await this.repository.findSession('user_sessions', {
			id: id,
			api_key_id: api_key_id,
		});

		if (!findSession) {
			throw new UnauthorizedException('Invalid credentials');
		}

		try {
			await this.repository.updateCodeToExpired(
				'auth_codes',
				findSession.user_id,
				this.helper.subtractMinutesFromDate(new Date(), 1),
			);

			await this.repository.updateTokenStatusByUserId(
				'user_sessions',
				LOGGED_OUT,
				findSession.user_id,
			);
		} catch (error) {
			throw error;
		}
	}
}
