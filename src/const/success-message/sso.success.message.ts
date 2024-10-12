import { HttpStatus } from '@nestjs/common';

/**
 * Success message codes related to Single Sign-On (SSO) operations.
 * These codes represent various successful outcomes for SSO-related processes.
 */
export const ssoSuccessMessageCode = {
	/*** Server is running */
	SCDTDT0000: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0000', // A unique code representing the success scenario.
		message: 'Service Running.', // Description of the success scenario.
	},
	/*** Login success */
	SCDTDT0001: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0001', // A unique code representing the success scenario.
		message: 'Login success.', // Description of the success scenario.
	},
	/*** Email valid */
	SCDTDT0002: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0002', // A unique code representing the success scenario.
		message: 'Email valid.', // Description of the success scenario.
	},
	/*** Phone valid */
	SCDTDT0003: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0003', // A unique code representing the success scenario.
		message: 'Phone valid.', // Description of the success scenario.
	},
	/*** API key created successfully */
	SCDTDT0004: {
		httpCode: HttpStatus.CREATED,
		fabdCode: 'SCDTDT0004',
		message: 'API key created successfully.', // Description of API key creation success.
	},
	/*** API key rotated successfully */
	SCDTDT0005: {
		httpCode: HttpStatus.OK,
		fabdCode: 'SCDTDT0005',
		message: 'API key rotated successfully.', // Description of API key rotation success.
	},
	/*** API key revoked successfully */
	SCDTDT0006: {
		httpCode: HttpStatus.OK,
		fabdCode: 'SCDTDT0006',
		message: 'API key revoked successfully.', // Description of API key revocation success.
	},
	/*** Logout success */
	SCDTDT0007: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0007', // A unique code representing the success scenario.
		message: 'Logout success.', // Description of the success scenario.
	},
	/*** Register success */
	SCDTDT0008: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0008', // A unique code representing the success scenario.
		message: 'Register success.', // Description of the success scenario.
	},
	/*** Forgot success */
	SCDTDT0009: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0009', // A unique code representing the success scenario.
		message: 'Forgot Password success.', // Description of the success scenario.
	},
	/*** Otp Login success */
	SCDTDT0010: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0010', // A unique code representing the success scenario.
		message: 'Otp Login success.', // Description of the success scenario.
	},
	/*** Login Phone success */
	SCDTDT0011: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0011', // A unique code representing the success scenario.
		message: 'Login Phone success.', // Description of the success scenario.
	},
	/*** Username valid */
	SCDTDT0012: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0012', // A unique code representing the success scenario.
		message: 'Username valid.', // Description of the success scenario.
	},
	/*** Reset Password success */
	SCDTDT0013: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0013', // A unique code representing the success scenario.
		message: 'Reset Password success.', // Description of the success scenario.
	},
	/*** Check Expired Code */
	SCDTDT0014: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0014', // A unique code representing the success scenario.
		message: 'Check Expired Code success.', // Description of the success scenario.
	},
	/*** Login Nik success */
	SCDTDT0015: {
		httpCode: HttpStatus.CREATED, // HTTP status code indicating that the request has been fulfilled and has resulted in the creation of a resource.
		fabdCode: 'SCDTDT0015', // A unique code representing the success scenario.
		message: 'Login Nik success.', // Description of the success scenario.
	},
};
