import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './databases/typeorm.config';
import { AppController } from './app.controller';
import { TodoModule } from './modules/v1.0/todos/1.0/todo.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...AppDataSource.options,
		}),
		TodoModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
