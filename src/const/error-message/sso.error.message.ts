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
	/*** Email not found */
	ERDTTD0006: {
		httpCode: HttpStatus.NOT_FOUND,
		fabdCode: 'ERDTTD0006',
		message: 'Email not found.', // Error message for cases where the Email cannot be found.
	},
	/*** Phone not found */
	ERDTTD0007: {
		httpCode: HttpStatus.NOT_FOUND,
		fabdCode: 'ERDTTD0007',
		message: 'Phone not found.', // Error message for cases where the Phone cannot be found.
	},
	/*** Logout failed */
	ERDTTD0008: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0008',
		message: 'Logout failed.', // Error message for cases where the logout failed.
	},
	/*** Register failed */
	ERDTTD0009: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0009',
		message: 'Register failed.', // Error message for cases where the logout failed.
	},
	/*** Forgot Password failed */
	ERDTTD0010: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0010',
		message: 'Forgot Password failed.', // Error message for cases where the logout failed.
	},
	/*** Otp Login failed */
	ERDTTD0011: {
		httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
		fabdCode: 'ERDTTD0011',
		message: 'Otp Login failed.', // Error message for cases where the logout failed.
	},
	/*** Username not found */
	ERDTTD0012: {
		httpCode: HttpStatus.NOT_FOUND,
		fabdCode: 'ERDTTD0012',
		message: 'Username not found.', // Error message for cases where the Phone cannot be found.
	},
};
