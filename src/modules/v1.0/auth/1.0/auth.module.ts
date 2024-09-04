import { SECRET_KEY } from '@app/const'; // Importing the secret key for JWT from the configuration
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'; // Importing the necessary decorators and classes from NestJS
import { JwtModule } from '@nestjs/jwt'; // Importing the JwtModule for handling JWT functionalities
import { PassportModule } from '@nestjs/passport'; // Importing the PassportModule for handling authentication
import { TypeOrmModule } from '@nestjs/typeorm'; // Importing the TypeOrmModule for TypeORM integration
import { AuthControllerV10 } from './auth.controller'; // Importing the AuthController to handle authentication routes
import { LoginUseCase } from './usecases/login.usecase'; // Importing the use case for login logic
import { AuthRepository } from '../repositories/auth.repository'; // Importing the AuthRepository for database access
import { RegisterUseCase } from './usecases/register.usecase'; // Importing the use case for handling user registration
import { ValidateUseCase } from './usecases/validate.usecase'; // Importing the ValidateUseCase for validating email and phone numbers
import { ApiKeyMiddleware } from '@app/middlewares/checkApiKey.middleware'; // Importing middleware to check for API key validity
import { ApiKeyRepository } from '../../apiKey/repository/apiKey.repository'; // Importing the ApiKeyRepository for managing API keys
import { LogoutUseCase } from './usecases/logout.usecase'; // Importing the use case for handling user logout
import { ForgotPasswordUseCase } from './usecases/forgotPassword.usecase'; // Importing the use case for handling forgot password functionality
import { ResetPasswordUseCase } from './usecases/resetPassword.usecase'; // Importing the use case for handling password resets
import { OtpLoginPhoneUseCase } from './usecases/otpLoginPhone.usecase'; // Importing the use case for handling OTP-based phone login
import { LoginPhoneUseCase } from './usecases/loginPhone.usecase'; // Importing the use case for handling phone-based login
// import { RefreshTokenUseCase } from './usecases/refreshToken.usecase'; // Optional: Importing RefreshTokenUseCase for token refresh logic, if needed

/**
 * @module AuthModuleV10
 * @description
 * AuthModuleV10 is responsible for handling all authentication-related logic, including login, registration, validation, OTP handling, logout, and password reset functionality.
 *
 * This module integrates with the database, handles JWT token generation, and sets up the necessary middleware for API key validation.
 */
@Module({
	// Importing required modules for authentication, database integration, and JWT handling
	imports: [
		PassportModule, // PassportModule integrates the authentication strategies within NestJS
		JwtModule.register({
			secret: SECRET_KEY, // The secret key used to sign JWT tokens
			signOptions: { expiresIn: '15m' }, // Configuring JWT tokens to expire after 15 minutes
		}),
		TypeOrmModule.forFeature([]), // Importing TypeOrmModule for integrating with entities (none provided in this example)
	],
	// Defining the providers that this module will expose
	providers: [
		ValidateUseCase, // Use case for handling validation logic (e.g., email and phone validation)
		LoginUseCase, // Use case for handling login functionality
		// RefreshTokenUseCase, // Optional: Use case for handling token refreshing if enabled in the future
		RegisterUseCase, // Use case for handling registration of new users
		AuthRepository, // Repository for interacting with the authentication data (e.g., users, tokens)
		ApiKeyRepository, // Repository for managing API keys
		LogoutUseCase, // Use case for handling user logout logic
		ForgotPasswordUseCase, // Use case for handling forgot password requests
		ResetPasswordUseCase, // Use case for handling password reset functionality
		OtpLoginPhoneUseCase, // Use case for handling OTP login via phone number
		LoginPhoneUseCase, // Use case for handling login via phone number without OTP
	],
	// Defining the controllers that handle routing
	controllers: [AuthControllerV10], // AuthController manages authentication routes (e.g., login, registration)
})
export class AuthModuleV10 {
	/**
	 * @method configure
	 * @description
	 * Configures middleware for the AuthModuleV10. The ApiKeyMiddleware is applied to validate API keys for all routes under the 'v1.0/auth/*' path.
	 *
	 * @param {MiddlewareConsumer} consumer - The MiddlewareConsumer instance is used to apply middlewares to specific routes.
	 */
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(ApiKeyMiddleware) // Applying the ApiKeyMiddleware to check the validity of the API key
			.forRoutes({ path: 'v1.0/auth/*', method: RequestMethod.ALL }); // Applying the middleware to all routes that start with 'v1.0/auth/*'
	}
}
