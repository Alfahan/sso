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
};
