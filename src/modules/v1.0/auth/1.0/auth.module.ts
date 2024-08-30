import { SECRET_KEY } from '@app/const'; // Importing the secret key for JWT from the configuration
import { Module } from '@nestjs/common'; // Importing the Module decorator from NestJS
import { JwtModule } from '@nestjs/jwt'; // Importing the JwtModule for JWT functionalities
import { PassportModule } from '@nestjs/passport'; // Importing the PassportModule for authentication
import { TypeOrmModule } from '@nestjs/typeorm'; // Importing the TypeOrmModule for database integration
import { AuthControllerV10 } from './auth.controller'; // Importing the AuthController for handling authentication routes
import { LoginUseCase } from './usecases/login.usecase'; // Importing the LoginUseCase for handling login logic
import { AuthRepository } from '../repositories/auth.repository'; // Importing the AuthRepository for data access
import { RegisterUseCase } from './usecases/register.usecase'; // Importing the RegisterUseCase for handling registration logic
import { ValidateUseCase } from './usecases/validate.usecase';

// Defining the AuthModuleV10 module
@Module({
	// Configuring the imports for the module
	imports: [
		PassportModule, // Importing PassportModule for integrating authentication strategies
		JwtModule.register({
			secret: SECRET_KEY, // Configuring the secret key for signing JWT tokens
			signOptions: { expiresIn: '60s' }, // Setting the token lifetime to 60 seconds
		}),
		TypeOrmModule.forFeature([]), // Importing TypeOrmModule to work with TypeORM entities
	],
	// Defining the providers for the module
	providers: [ValidateUseCase, LoginUseCase, RegisterUseCase, AuthRepository], // Registering the use cases and repository as providers
	// Defining the controllers for the module
	controllers: [AuthControllerV10], // Registering the controller to handle authentication routes
})
export class AuthModuleV10 {}
