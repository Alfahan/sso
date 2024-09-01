import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyControllerV10 } from './apiKey.controller';
import { GenerateApiKeyUseCase } from './usecases/generate.usecase';
import { ApiKeyRepository } from '../repository/apiKey.repository';
import { RotateApiKeyUseCase } from './usecases/rotate.usecase';
import { RevokeApiKeyUseCase } from './usecases/revoke.usecase';

/**
 * @module ApiKeyModuleV10
 * @description
 * Module responsible for handling API key operations such as generating, rotating, and revoking API keys.
 * This module includes a controller and providers for business logic related to API key management.
 *
 * Imports TypeORM's repository pattern for database interaction.
 */
@Module({
	// Import TypeORM module for working with the database entities
	imports: [TypeOrmModule.forFeature([])],

	// Providers include the use cases and repository for API key management
	providers: [
		RotateApiKeyUseCase, // Use case for rotating API keys
		RevokeApiKeyUseCase, // Use case for revoking API keys
		GenerateApiKeyUseCase, // Use case for generating new API keys
		ApiKeyRepository, // Repository for database interactions related to API keys
	],

	// Controller that handles incoming API requests related to API keys
	controllers: [ApiKeyControllerV10],
})
export class ApiKeyModuleV10 {}
