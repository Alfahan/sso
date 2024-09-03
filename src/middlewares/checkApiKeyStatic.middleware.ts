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
			// If API key is valid, proceed to the next middleware or controller
			next();
		} catch (error) {
			// Handling any caught errors during validation
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
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
