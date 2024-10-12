import {
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { RegisterUseCase } from './usecases/register.usecase';
import { ApiResponse } from '@app/common/api-response';
import { Request, Response } from 'express';
import { successCode } from '@app/const/success-message';
import { errorCode } from '@app/const/error-message';

@Controller({ path: 'sso/v1.0/register' })
export class RegisterControllerV10 {
	constructor(
		private readonly registerUseCase: RegisterUseCase, // Handles user registration
	) {}

	/**
	 * @route POST /auth/register
	 * @description Registers a new user by creating a new user record in the system.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing user registration details in the request body.
	 * @returns {Promise<Response>} - Returns a successful response upon successful registration.
	 * @throws {HttpException} - Throws an exception if registration fails.
	 */
	@Post('/:segment')
	async register(
		@Req() req: Request, // Injecting the Express request object
		@Res() res: Response, // Injecting the Express response object
	): Promise<Response> {
		try {
			const data = await this.registerUseCase.register(req); // Calling registration logic
			return ApiResponse.success(res, data, successCode.SCDTDT0008); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					null,
					errorCode.ERDTTD0009,
					error.message,
				); // Handling registration error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}
}
