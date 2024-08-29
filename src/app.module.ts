import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './databases/typeorm.config';
import { AppController } from './app.controller';
import { TodoModule } from './modules/v1.0/todos/1.0/todo.module';
import { AuthModuleV10 } from './modules/v1.0/auth/1.0/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				name: 'long',
				ttl: 60000,
				limit: 500,
			},
		]),
		TypeOrmModule.forRoot({
			...AppDataSource.options,
		}),
		TodoModule,
		AuthModuleV10,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
