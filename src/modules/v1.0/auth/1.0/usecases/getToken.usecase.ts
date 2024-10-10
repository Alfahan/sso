import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../repositories/auth.repository';
import { Request, Response } from 'express';
import * as geoip from 'geoip-lite';
import * as useragent from 'useragent';
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
		req: Request,
		res: Response,
	): Promise<{ access_token: string; refresh_token: string }> {
		const { code } = req.body;
		const api_key_id = res.locals.api_key_id;
		const geo = geoip.lookup(req.ip);
		const agent = useragent.parse(req.headers['user-agent']);
		const findCode = await this.repository.findCode('auth_codes', code);
		// Generate new tokens
		const { accessToken, refreshToken, uuid } =
			this.helper.generateTokens();

		if (!findCode) {
			throw new UnauthorizedException(
				'For security reasons, your session has ended. Please log in again to continue',
			);
		}

		// Check if code is valid and not expired
		if (new Date() > findCode.expires_at) {
			await this.handleFailedAttempt(findCode);
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN_SUCCESS',
				findCode.user_id,
			);
			throw new UnauthorizedException('Expired code.');
		}

		// Check for existing token
		const existingToken = await this.repository.cekValidateToken(
			'user_sessions',
			{
				user_id: findCode.user_id,
				api_key_id,
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
			this.jwtService.verify(existingToken.token, {
				ignoreExpiration: true,
			});
			await this.helper.logAuthHistory(
				req,
				geo,
				agent,
				'LOGIN',
				findCode.user_id,
			);

			await this.repository.updateTokenStatus(
				'user_sessions',
				{
					token: accessToken,
					refresh_token: refreshToken,
					status: LOGGED_IN,
				},
				existingToken.id,
			);
			return {
				access_token: existingToken.token,
				refresh_token: existingToken.refresh_token,
			};
		}

		const tokenData = {
			id: uuid,
			user_id: findCode.user_id,
			api_key_id,
			token: accessToken,
			refresh_token: refreshToken,
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

		return { access_token: accessToken, refresh_token: refreshToken };
	}

	private async handleFailedAttempt(findCode: any) {
		if (findCode) {
			await this.helper.incrementFailedAttempts(findCode.user_id);
			await this.repository.updateCodeStatus(
				'auth_codes',
				TOKEN_INVALID,
				findCode.ac_id,
			);
		}
	}
}
