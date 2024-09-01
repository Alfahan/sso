import { HttpStatus } from '@nestjs/common';

/**
 * Success message codes related to Single Sign-On (SSO) operations.
 * These codes represent various successful outcomes for SSO-related processes.
 */
export const ssoSuccessMessageCode = {
	/*** Server is running */
	SCDTDT0000: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCCSCS0000', // A unique code representing the success scenario.
		message: 'Service Running.', // Description of the success scenario.
	},
	/*** Login success */
	SCDTDT0001: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCCSCS0001', // A unique code representing the success scenario.
		message: 'Login success.', // Description of the success scenario.
	},
	/*** Email valid */
	SCDTDT0002: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCCSCS0002', // A unique code representing the success scenario.
		message: 'Email valid.', // Description of the success scenario.
	},
	/*** Phone valid */
	SCDTDT0003: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCCSCS0003', // A unique code representing the success scenario.
		message: 'Phone valid.', // Description of the success scenario.
	},
	/*** API key created successfully */
	SCDTDT0004: {
		httpCode: HttpStatus.CREATED,
		fabdCode: 'SCCSCS0004',
		message: 'API key created successfully.', // Description of API key creation success.
	},
	/*** API key rotated successfully */
	SCDTDT0005: {
		httpCode: HttpStatus.OK,
		fabdCode: 'SCCSCS0005',
		message: 'API key rotated successfully.', // Description of API key rotation success.
	},
	/*** API key revoked successfully */
	SCDTDT0006: {
		httpCode: HttpStatus.OK,
		fabdCode: 'SCCSCS0006',
		message: 'API key revoked successfully.', // Description of API key revocation success.
	},
};
