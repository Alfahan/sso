import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
	constructor(message?: string) {
		super(
			message || 'Too many requests, please try again later.',
			HttpStatus.TOO_MANY_REQUESTS,
		);
	}
}
