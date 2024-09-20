import { ApiResponse } from '@app/common/api-response';
import {
	Controller,
	Delete,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GenerateApiKeyUseCase } from './usecases/generate.usecase';
import { successCode } from '@app/const/success-message';
import { errorCode } from '@app/const/error-message';
import { RotateApiKeyUseCase } from './usecases/rotate.usecase';
import { RevokeApiKeyUseCase } from './usecases/revoke.usecase';

/**
 * @controller ApiKeyControllerV10
 * @description
 * This controller handles API key operations for version 1.0 of the API, such as generating, rotating, and revoking API keys.
 */
@Controller({ path: 'sso/v1.0/api-key' })
export class ApiKeyControllerV10 {
	constructor(
		private readonly revokeApiKey: RevokeApiKeyUseCase,
		private readonly generateApiKey: GenerateApiKeyUseCase,
		private readonly rotateApiKey: RotateApiKeyUseCase,
	) {}

	/**
	 * @method createApiKey
	 * @description
	 * Generates a new API key by calling the `GenerateApiKeyUseCase` service. Returns a success response with the newly generated API key.
	 *
	 * @param {Response} res - The HTTP response object
	 * @param {Request} req - The HTTP request object
	 * @returns {Promise<Response>} - Returns the response with the newly generated API key or an error response if any exception occurs.
	 *
	 * @example
	 * POST /api-key/generate
	 */
	@Post('generate')
	async createApiKey(
		@Res() res: Response,
		@Req() req: Request,
	): Promise<Response> {
		try {
			const data = await this.generateApiKey.createApiKey(req);
			return ApiResponse.success(res, data, successCode.SCDTDT0004);
		} catch (error) {
			// Handling any caught errors during validation
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0002,
					error.stack,
				);
			}
			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * @method recreateApiKey
	 * @description
	 * Rotates (recreates) an existing API key by calling the `RotateApiKeyUseCase` service. Returns a success response with the updated API key.
	 *
	 * @param {Response} res - The HTTP response object
	 * @param {Request} req - The HTTP request object
	 * @returns {Promise<Response>} - Returns the response with the rotated API key or an error response if any exception occurs.
	 *
	 * @example
	 * POST /api-key/rotate
	 */
	@Post('rotate')
	async recreateApiKey(
		@Res() res: Response,
		@Req() req: Request,
	): Promise<Response> {
		try {
			const data = await this.rotateApiKey.recreateApiKey(req);
			return ApiResponse.success(res, data, successCode.SCDTDT0005);
		} catch (error) {
			// Handling any caught errors during validation
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0003,
					error.stack,
				);
			}
			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * @method removeApiKey
	 * @description
	 * Revokes an existing API key by calling the `RevokeApiKeyUseCase` service. Returns a success response if the API key is successfully revoked.
	 *
	 * @param {Response} res - The HTTP response object
	 * @param {Request} req - The HTTP request object
	 * @returns {Promise<Response>} - Returns the response confirming the API key revocation or an error response if any exception occurs.
	 *
	 * @example
	 * DELETE /api-key/revoke
	 */
	@Delete('revoke')
	async removeApiKey(
		@Res() res: Response,
		@Req() req: Request,
	): Promise<Response> {
		try {
			const data = await this.revokeApiKey.removeApiKey(req);
			return ApiResponse.success(res, data, successCode.SCDTDT0006);
		} catch (error) {
			// Handling any caught errors during validation
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0004,
					error.stack,
				);
			}
			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
