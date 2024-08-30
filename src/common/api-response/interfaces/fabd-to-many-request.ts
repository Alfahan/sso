import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception class for handling cases where there are too many requests.
 * This exception is thrown when the rate limit for requests has been exceeded.
 */
export class TooManyRequestsException extends HttpException {
	/**
	 * Creates an instance of TooManyRequestsException.
	 *
	 * @param message - Optional custom message to provide additional context for the exception.
	 * Defaults to 'Too many requests, please try again later.' if not provided.
	 */
	constructor(message?: string) {
		super(
			message || 'Too many requests, please try again later.',
			HttpStatus.TOO_MANY_REQUESTS,
		);
	}
}
