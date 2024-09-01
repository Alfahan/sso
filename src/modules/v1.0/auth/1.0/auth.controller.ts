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
import { LogoutUseCase } from './usecases/logout.usecase';
// import { RefreshTokenUseCase } from './usecases/refreshToken.usecase';

// Defining the controller for handling authentication-related routes
@Controller({ path: 'auth', version: '1.0' }) // Specifying the base path and version for the controller
export class AuthControllerV10 {
	// Injecting the use cases via the constructor
	constructor(
		private readonly logoutUseCase: LogoutUseCase,
		private readonly validateUseCase: ValidateUseCase, // Dependency injection for email and phone validation use case
		private readonly loginUseCase: LoginUseCase, // Dependency injection for login use case
		// private readonly refreshTokenUseCase: RefreshTokenUseCase,
		private readonly registerUseCase: RegisterUseCase, // Dependency injection for register use case
	) {}

	/**
	 * @route POST /auth/validate-email
	 * @description Validates if the provided email exists in the repository.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the email in the request body.
	 * @returns {Promise<Response>} - Returns a successful response if email is found, otherwise an error response.
	 * @throws {BadRequestException} - Throws an exception if the email is not provided or not found.
	 */
	@Post('/validate-email')
	async validateEmail(
		@Res() res: Response, // Injecting the response object from express
		@Req() req: Request, // Injecting the request object from express
	): Promise<Response> {
		try {
			// Calling the validateEmail method of ValidateUseCase with the request data
			const data = await this.validateUseCase.validateEmail(req);

			// Returning a successful response using ApiResponse utility with a success code
			return ApiResponse.success(res, data, successCode.SCDTDT0002);
		} catch (error) {
			// Handling any caught errors during validation
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				);
			}

			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * @route POST /auth/validate-phone
	 * @description Validates if the provided phone number exists in the repository.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing the phone number in the request body.
	 * @returns {Promise<Response>} - Returns a successful response if phone number is found, otherwise an error response.
	 * @throws {BadRequestException} - Throws an exception if the phone number is not provided or not found.
	 */
	@Post('/validate-phone')
	async validatePhone(
		@Res() res: Response, // Injecting the response object from express
		@Req() req: Request, // Injecting the request object from express
	): Promise<Response> {
		try {
			// Calling the validatePhone method of ValidateUseCase with the request data
			const data = await this.validateUseCase.validatePhone(req);

			// Returning a successful response using ApiResponse utility with a success code
			return ApiResponse.success(res, data, successCode.SCDTDT0003);
		} catch (error) {
			// Handling any caught errors during validation
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				);
			}

			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * @route POST /auth/login
	 * @description Handles user login by verifying credentials and returning authentication tokens.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing login credentials in the request body.
	 * @returns {Promise<Response>} - Returns a successful response with authentication tokens, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if there is an error during login.
	 */
	@Post('/login')
	async login(
		@Res() res: Response, // Injecting the response object from express
		@Req() req: Request, // Injecting the request object from express
	): Promise<Response> {
		try {
			// Calling the login method of LoginUseCase with the request data
			const data = await this.loginUseCase.login(req);

			// Returning a successful response using ApiResponse utility with a success code
			return ApiResponse.success(res, data, successCode.SCDTDT0001);
		} catch (error) {
			// Handling any caught errors during login
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				);
			}

			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('/logout')
	async logout(
		@Res() res: Response, // Injecting the response object from Express
		@Req() req: Request, // Injecting the request object from Express
	): Promise<Response> {
		try {
			// Calling the logout method of LogoutUseCase with the request data
			await this.logoutUseCase.logout(req);

			// Returning a successful response using ApiResponse utility with a success code
			return ApiResponse.success(res, null, successCode.SCDTDT0002);
		} catch (error) {
			// Handling any caught errors during logout
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0002,
					error.stack,
				);
			}

			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// @Post('refresh-token')
	// async refreshToken(
	// 	@Res() res: Response,
	// 	@Req() req: Request,
	// ): Promise<Response> {
	// 	try {
	// 		const data = await this.refreshTokenUseCase.refreshToken(req);

	// 		return ApiResponse.success(res, data, successCode.SCDTDT0001);
	// 	} catch (error) {
	// 		// Handling any caught errors during registration
	// 		if (error instanceof Error) {
	// 			// Returning a failure response using ApiResponse utility with an error code and stack trace
	// 			return ApiResponse.fail(
	// 				res,
	// 				error.message,
	// 				errorCode.ERDTTD0001,
	// 				error.stack,
	// 			);
	// 		}

	// 		// Throwing a generic internal server error if the error does not match the expected type
	// 		throw new HttpException(
	// 			error.message,
	// 			HttpStatus.INTERNAL_SERVER_ERROR,
	// 		);
	// 	}
	// }

	/**
	 * @route POST /auth/register
	 * @description Registers a new user by creating a new user record in the repository.
	 * @param {Response} res - The Express response object used to send the response.
	 * @param {Request} req - The Express request object containing user registration details in the request body.
	 * @returns {Promise<Response>} - Returns a successful response upon successful registration, otherwise an error response.
	 * @throws {HttpException} - Throws an exception if there is an error during registration.
	 */
	@Post('register')
	async register(
		@Res() res: Response, // Injecting the response object from express
		@Req() req: Request, // Injecting the request object from express
	): Promise<Response> {
		try {
			// Calling the register method of RegisterUseCase with the request data
			const data = await this.registerUseCase.register(req);

			// Returning a successful response using ApiResponse utility with a success code
			return ApiResponse.success(res, data, successCode.SCDTDT0001);
		} catch (error) {
			// Handling any caught errors during registration
			if (error instanceof Error) {
				// Returning a failure response using ApiResponse utility with an error code and stack trace
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERDTTD0001,
					error.stack,
				);
			}

			// Throwing a generic internal server error if the error does not match the expected type
			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
