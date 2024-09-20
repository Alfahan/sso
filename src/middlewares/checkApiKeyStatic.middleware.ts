import { ApiResponse } from '@app/common/api-response';
import { API_KEY_STATIC } from '@app/const';
import { errorCode } from '@app/const/error-message';
import {
	HttpException,
	HttpStatus,
	Injectable,
	NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyStaticMiddleware implements NestMiddleware {
	constructor() {}
	async use(req: Request, res: Response, next: NextFunction) {
		const apiKey = req.headers['x-api-key'] as string;

		if (!apiKey) {
			throw new HttpException('API key missing', HttpStatus.UNAUTHORIZED);
		}

		try {
			if (apiKey !== API_KEY_STATIC) {
				throw new HttpException(
					'Invalid API key',
					HttpStatus.UNAUTHORIZED,
				);
			}
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
