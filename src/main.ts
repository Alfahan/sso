import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './const';

async function bootstrap() {
	// Create a NestJS application instance with CORS enabled
	const app = await NestFactory.create(AppModule, { cors: true });

	app.enableCors({
		origin: '*',
		methods: 'GET,POST,PUT,PATCH,DELETE',
		allowedHeaders: 'Content-Type, Authorization, x-api-key',
		credentials: true,
	});

	// Enable versioning of the API routes
	app.enableVersioning();

	// Start the application and listen on the specified port
	await app.listen(PORT);
}

// Call the bootstrap function to initialize the application
bootstrap();
