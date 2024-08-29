import {
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { LoginUseCase } from './usecases/login.usecase';
import { Request, Response } from 'express';
import { ApiResponse } from '@app/common/api-response';
import { successCode } from '@app/const/success-message';
import { errorCode } from '@app/const/error-message';
import { RegisterUseCase } from './usecases/register.usecase';

@Controller({ path: 'auth', version: '1.0' })
export class AuthControllerV10 {
	constructor(
		private readonly loginUseCase: LoginUseCase,
		private readonly registerUseCase: RegisterUseCase,
	) {}

	@Post('/login')
	async login(@Res() res: Response, @Req() req: Request): Promise<Response> {
		try {
			const data = await this.loginUseCase.login(req);
			return ApiResponse.success(res, data, successCode.SCDTDT0001);
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
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('register')
	async register(
		@Res() res: Response,
		@Req() req: Request,
	): Promise<Response> {
		try {
			const data = await this.registerUseCase.register(req);
			return ApiResponse.success(res, data, successCode.SCDTDT0001);
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
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
