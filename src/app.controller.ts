import { Controller, Get, Res } from '@nestjs/common';
import { APP_NAME } from './const';
import { Response } from 'express';
import { ApiResponse } from './common/api-response';
import { successCode } from './const/success-message';

@Controller()
export class AppController {
	constructor() {}

	@Get('core-customer-sso-api/health-check')
	index(@Res() response: Response): Response {
		const message = `Service ${APP_NAME} is running.`;
		return ApiResponse.success(response, message, successCode.SCDTDT0000);
	}
}
