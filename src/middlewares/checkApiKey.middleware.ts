import { ApiResponse } from '@app/common/api-response';
import { API_KEY_VALID } from '@app/const';
import { errorCode } from '@app/const/error-message';
import { ApiKeyRepository } from '@app/modules/v1.0/apiKey/repository/apiKey.repository';
import {
	HttpException,
	HttpStatus,
	Injectable,
	NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
	constructor(private readonly apiKeyRepository: ApiKeyRepository) {}
	/**
	 * Middleware API Key Client
	 * @author telkomdev-alfahan
	 * @date 2024-10-06
	 * @param { Request } req
	 * @param { Response } res
	 * @param { NextFunction } next
	 */
	async use(req: Request, res: Response, next: NextFunction) {
		const apiKey = req.headers['x-api-key'] as string;

		if (!apiKey) {
			throw new HttpException(
				'Invalid credentials',
				HttpStatus.UNAUTHORIZED,
			);
		}

		try {
			const findApiKeyMid = await this.apiKeyRepository.findApiKeyMid(
				'api_keys',
				{ api_key: apiKey, status: API_KEY_VALID },
			);

			if (!findApiKeyMid) {
				throw new HttpException(
					'Invalid credentials',
					HttpStatus.UNAUTHORIZED,
				);
			}

			res.locals.api_key_id = findApiKeyMid.id;

			next();
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				);
			}
			throw new HttpException(
				'Server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
