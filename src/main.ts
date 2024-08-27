import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './const';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	app.enableCors();

	// versioning
	app.enableVersioning();

	await app.listen(PORT);
}

bootstrap();
