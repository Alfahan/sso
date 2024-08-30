import { HttpStatus } from '@nestjs/common';

/**
 * Error message codes for Single Sign-On (SSO) related issues.
 */
export const ssoErrorMessageCode = {
	/*** Unauthorized Access Error */
	ERDTTD0001: {
		httpCode: HttpStatus.UNAUTHORIZED, // HTTP status code for unauthorized access.
		fabdCode: 'ERDTTD0001', // Unique error code for identifying unauthorized access errors.
		message: 'Unauthorized', // Human-readable message indicating unauthorized access.
	},
};
