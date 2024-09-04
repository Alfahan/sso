import {
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common'; // Importing necessary decorators and classes from NestJS
import { LoginUseCase } from './usecases/login.usecase'; // Importing the LoginUseCase for handling login logic
import { Request, Response } from 'express'; // Importing Request and Response from express for type safety
import { ApiResponse } from '@app/common/api-response'; // Importing ApiResponse utility for consistent API responses
import { successCode } from '@app/const/success-message'; // Importing predefined success message codes
import { errorCode } from '@app/const/error-message'; // Importing predefined error message codes
import { RegisterUseCase } from './usecases/register.usecase'; // Importing the RegisterUseCase for handling registration logic
import { ValidateUseCase } from './usecases/validate.usecase'; // Importing the ValidateUseCase for email and phone validation
import { LogoutUseCase } from './usecases/logout.usecase'; // Importing the LogoutUseCase for handling logout logic
import { ForgotPasswordUseCase } from './usecases/forgotPassword.usecase'; // Importing ForgotPasswordUseCase for handling password recovery
import { ResetPasswordUseCase } from './usecases/resetPassword.usecase'; // Importing ResetPasswordUseCase for resetting the password
import { OtpLoginPhoneUseCase } from './usecases/otpLoginPhone.usecase';
import { LoginPhoneUseCase } from './usecases/loginPhone.usecase';
// import { RefreshTokenUseCase } from './usecases/refreshToken.usecase'; // (Optional) Refresh Token Use Case can be added here in the future

/**
 * @class AuthControllerV10
 * @description Controller for handling authentication-related routes such as login, registration, validation, logout, password recovery, etc.
 */
@Controller({ path: 'auth', version: '1.0' }) // Defining the base path and version for the authentication controller
export class AuthControllerV10 {
	// Injecting various use cases through the constructor
	constructor(
		private readonly logoutUseCase: LogoutUseCase, // Handles user logout
		private readonly otpLoginPhoneUseCase: OtpLoginPhoneUseCase,
		private readonly forgotPasswordUseCase: ForgotPasswordUseCase, // Handles forgot password requests
		private readonly resetPasswordUseCase: ResetPasswordUseCase, // Handles password reset requests
		private readonly validateUseCase: ValidateUseCase, // Handles email and phone number validation
		private readonly loginUseCase: LoginUseCase, // Handles user login
		private readonly loginPhoneUseCase: LoginPhoneUseCase,
		// private readonly refreshTokenUseCase: RefreshTokenUseCase, // (Optional) Refresh Token Use Case can be added
		private readonly registerUseCase: RegisterUseCase, // Handles user registration
	) {}

	/**
	 * @route POST /auth/validate-email
	 * @description Validates if the provided email exists in the system.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the email in the request body.
	 * @returns {Promise<Response>} - Returns a successful response if the email is valid, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if the email is not found or validation fails.
	 */
	@Post('/validate-email')
	async validateEmail(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.validateUseCase.validateEmail(req); // Calling the validation logic for email
			return ApiResponse.success(res, data, successCode.SCDTDT0002); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0006,
					error.stack,
				); // Handling validation error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/validate-phone
	 * @description Validates if the provided phone number exists in the system.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the phone number in the request body.
	 * @returns {Promise<Response>} - Returns a successful response if the phone number is valid, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if the phone number is not found or validation fails.
	 */
	@Post('/validate-phone')
	async validatePhone(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.validateUseCase.validatePhone(req); // Calling the validation logic for phone
			return ApiResponse.success(res, data, successCode.SCDTDT0003); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				); // Handling validation error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/validate-username
	 * @description Validates if the provided username exists in the system.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the username in the request body.
	 * @returns {Promise<Response>} - Returns a successful response if the username is valid, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if validation fails or an unexpected error occurs.
	 */
	@Post('/validate-username')
	async validateUsername(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.validateUseCase.validateUsername(req); // Calling the validation logic for username
			return ApiResponse.success(res, data, successCode.SCDTDT0012); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0012,
					error.stack,
				); // Handling validation error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/login
	 * @description Handles user login by verifying credentials and returning authentication tokens.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing login credentials in the request body.
	 * @returns {Promise<Response>} - Returns a successful response with authentication tokens, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if login fails.
	 */
	@Post('/login')
	async login(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.loginUseCase.login(req); // Calling login logic
			return ApiResponse.success(res, data, successCode.SCDTDT0001); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				); // Handling login error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/otp-login-phone
	 * @description Initiates the login process using OTP (One-Time Password) via phone.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the phone number in the request body.
	 * @returns {Promise<Response>} - Returns a successful response with OTP data if the request is successful, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if OTP generation fails or an unexpected error occurs.
	 */
	@Post('/otp-login-phone')
	async otpLoginPhone(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.otpLoginPhoneUseCase.requestOtp(req); // Calling OTP request logic
			return ApiResponse.success(res, data, successCode.SCDTDT0010); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0011,
					error.stack,
				); // Handling OTP login error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/login-phone
	 * @description Handles the login process using a phone number.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the phone number and credentials in the request body.
	 * @returns {Promise<Response>} - Returns a successful response if the login is successful, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if the login fails or an unexpected error occurs.
	 */
	@Post('/login-phone')
	async loginPhone(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.loginPhoneUseCase.login(req); // Calling login logic
			return ApiResponse.success(res, data, successCode.SCDTDT0011); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				); // Handling login error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/logout
	 * @description Logs out the user by invalidating their session or tokens.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing logout information.
	 * @returns {Promise<Response>} - Returns a successful response upon successful logout.
	 * @throws {HttpException} - Throws an exception if logout fails.
	 */
	@Post('/logout')
	async logout(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			await this.logoutUseCase.logout(req); // Calling logout logic
			return ApiResponse.success(res, null, successCode.SCDTDT0007); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0008,
					error.stack,
				); // Handling logout error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/register
	 * @description Registers a new user by creating a new user record in the system.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing user registration details in the request body.
	 * @returns {Promise<Response>} - Returns a successful response upon successful registration.
	 * @throws {HttpException} - Throws an exception if registration fails.
	 */
	@Post('/register')
	async register(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.registerUseCase.register(req); // Calling registration logic
			return ApiResponse.success(res, data, successCode.SCDTDT0008); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0009,
					error.stack,
				); // Handling registration error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/forgot-password
	 * @description Handles forgot password requests by generating a reset token and sending recovery instructions to the user's email.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the email for password recovery.
	 * @returns {Promise<Response>} - Returns a successful response upon successful request submission.
	 * @throws {HttpException} - Throws an exception if the process fails.
	 */
	@Post('/forgot-password')
	async forgotPassword(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.forgotPasswordUseCase.forgotPassword(req); // Calling forgot password logic
			return ApiResponse.success(res, data, successCode.SCDTDT0009); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0010,
					error.stack,
				); // Handling forgot password error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}

	/**
	 * @route POST /auth/reset-password
	 * @description Resets the user's password using a valid reset token.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the new password and reset token.
	 * @returns {Promise<Response>} - Returns a successful response if the password is reset successfully.
	 * @throws {HttpException} - Throws an exception if the reset fails.
	 */
	@Post('/reset-password/:token')
	async resetPassword(
		@Res() res: Response, // Injecting the Express response object
		@Req() req: Request, // Injecting the Express request object
	): Promise<Response> {
		try {
			const data = await this.resetPasswordUseCase.resetPassword(req); // Calling reset password logic
			return ApiResponse.success(res, data, successCode.SCDTDT0002); // Returning success response
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0002,
					error.stack,
				); // Handling reset password error
			}
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			); // Throwing internal server error
		}
	}
}
