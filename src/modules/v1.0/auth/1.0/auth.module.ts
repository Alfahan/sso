import { SECRET_KEY } from '@app/const'; // Importing the secret key for JWT from the configuration
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'; // Importing the Module decorator from NestJS
import { JwtModule } from '@nestjs/jwt'; // Importing the JwtModule for JWT functionalities
import { PassportModule } from '@nestjs/passport'; // Importing the PassportModule for authentication
import { TypeOrmModule } from '@nestjs/typeorm'; // Importing the TypeOrmModule for database integration
import { AuthControllerV10 } from './auth.controller'; // Importing the AuthController for handling authentication routes
import { LoginUseCase } from './usecases/login.usecase'; // Importing the LoginUseCase for handling login logic
import { AuthRepository } from '../repositories/auth.repository'; // Importing the AuthRepository for data access
import { RegisterUseCase } from './usecases/register.usecase'; // Importing the RegisterUseCase for handling registration logic
import { ValidateUseCase } from './usecases/validate.usecase'; // Importing the ValidateUseCase for email and phone validation
import { ApiKeyMiddleware } from '@app/middlewares/checkApiKey.middleware'; // Importing the middleware for API key validation
import { ApiKeyRepository } from '../../apiKey/repository/apiKey.repository'; // Importing the ApiKeyRepository for managing API keys
import { LogoutUseCase } from './usecases/logout.usecase'; // Importing the LogoutUseCase for handling logout logic
import { ForgotPasswordUseCase } from './usecases/forgotPassword.usecase'; // Importing the ForgotPasswordUseCase for handling forgot password logic
import { ResetPasswordUseCase } from './usecases/resetPassword.usecase'; // Importing the ResetPasswordUseCase for handling password reset logic
// import { RefreshTokenUseCase } from './usecases/refreshToken.usecase'; // Importing RefreshTokenUseCase if needed in the future

/**
 * AuthModuleV10 is responsible for handling all authentication-related logic, including login, registration, validation, logout, and password reset functionality.
 *
 * This module registers relevant use cases, repositories, and controllers to manage authentication flows.
 */
@Module({
	// Configuring the imports for the module
	imports: [
		PassportModule, // Importing PassportModule for integrating authentication strategies
		JwtModule.register({
			secret: SECRET_KEY, // Configuring the secret key for signing JWT tokens
			signOptions: { expiresIn: '15m' }, // Setting the token lifetime to 15 minutes
		}),
		TypeOrmModule.forFeature([]), // Importing TypeOrmModule to work with TypeORM entities, if any
	],
	// Defining the providers for the module
	providers: [
		ValidateUseCase, // Providing the use case for validation logic (e.g., email, phone validation)
		LoginUseCase, // Providing the use case for login logic
		// RefreshTokenUseCase, // Providing the use case for refreshing tokens, if needed
		RegisterUseCase, // Providing the use case for registration logic
		AuthRepository, // Providing the repository for accessing authentication data (e.g., users, tokens)
		ApiKeyRepository, // Providing the repository for managing API keys
		LogoutUseCase, // Providing the use case for handling logout functionality
		ForgotPasswordUseCase, // Providing the use case for handling forgot password functionality
		ResetPasswordUseCase, // Providing the use case for handling password reset functionality
	],
	// Defining the controllers for the module
	controllers: [AuthControllerV10], // Registering the AuthController to handle authentication routes
})
export class AuthModuleV10 {
	/**
	 * Configures the middleware for the module.
	 * Applies the ApiKeyMiddleware to validate API keys for all routes under the 'v1.0/auth/*' path.
	 *
	 * @param {MiddlewareConsumer} consumer - The MiddlewareConsumer instance used for configuring middlewares.
	 */
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(ApiKeyMiddleware) // Applying the ApiKeyMiddleware to validate API keys
			.forRoutes({ path: 'v1.0/auth/*', method: RequestMethod.ALL }); // Applying the middleware to all routes under 'v1.0/auth/*'
	}
}
