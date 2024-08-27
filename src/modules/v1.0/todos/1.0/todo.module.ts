import { Todo } from '@app/entities/todo.entity';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { TodoRepository } from '../repositories/todo.repository';
import { ReadTodoUseCase } from './usecases/readTodo.usecase';
import { CreateTodoUseCase } from './usecases/createTodo.usecase';
import { ReadAllTodoUseCase } from './usecases/readAllTodo.usecase';
import { UpdateTodoUseCase } from './usecases/updateTodo.usecase';
import { DeleteTodoUseCase } from './usecases/deleteTodo.usecase';

@Module({
	imports: [TypeOrmModule.forFeature([Todo])],
	controllers: [TodoController],
	exports: [TodoRepository],
	providers: [
		ReadAllTodoUseCase,
		ReadTodoUseCase,
		CreateTodoUseCase,
		UpdateTodoUseCase,
		DeleteTodoUseCase,
		TodoRepository,
	],
})
export class TodoModule implements NestModule {
	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	configure(_consumer: MiddlewareConsumer) {}
}
