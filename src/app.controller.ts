import { Controller, Get, Res } from '@nestjs/common';
import { APP_NAME } from './const';
import { Response } from 'express';
import { ApiResponse } from './common/api-response';
import { successCode } from './const/success-message';

@Controller()
export class AppController {
	constructor() {}

	/**
	 * Health check endpoint to verify if the service is running.
	 * @param response - The Express response object used to send the response.
	 * @returns A success response with a message indicating the service status.
	 */
	@Get('sso/health-check')
	index(@Res() response: Response): Response {
		// Message to be included in the success response
		const message = `Service ${APP_NAME} is running.`;

		// Use the ApiResponse class to format and send the success response
		return ApiResponse.success(response, message, successCode.SCDTDT0000);
	}
}
