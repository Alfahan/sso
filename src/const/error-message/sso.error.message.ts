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
	/*** API key creation failed */
	ERDTTD0002: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0002',
		message: 'API key creation failed.', // Error message for API key creation failure.
	},
	/*** API key rotation failed */
	ERDTTD0003: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0003',
		message: 'API key rotation failed.', // Error message for API key rotation failure.
	},
	/*** API key revocation failed */
	ERDTTD0004: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0004',
		message: 'API key revocation failed.', // Error message for API key revocation failure.
	},
	/*** API key not found */
	ERDTTD0005: {
		httpCode: HttpStatus.NOT_FOUND,
		fabdCode: 'ERDTTD0005',
		message: 'API key not found.', // Error message for cases where the API key cannot be found.
	},
};
