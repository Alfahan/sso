import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './databases/typeorm.config';
import { AppController } from './app.controller';
import { TodoModule } from './modules/v1.0/todos/1.0/todo.module';
import { AuthModuleV10 } from './modules/v1.0/auth/1.0/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		// Configure rate limiting for the application
		ThrottlerModule.forRoot([
			{
				name: 'long',
				ttl: 60000, // Time-to-live for the rate limit in milliseconds
				limit: 500, // Maximum number of requests allowed within the TTL
			},
		]),
		// Set up TypeORM with the configuration options from AppDataSource
		TypeOrmModule.forRoot({
			...AppDataSource.options, // Spread the TypeORM configuration options
		}),
		// Import Todo module for managing todo items
		TodoModule,
		// Import Auth module for handling authentication
		AuthModuleV10,
	],
	// Register the main application controller
	controllers: [AppController],
	// Providers array can be used to define global services, but it is empty here
	providers: [],
})
export class AppModule {}
