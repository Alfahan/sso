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
	imports: [
		// Import TypeOrmModule to access the Todo entity for this module
		TypeOrmModule.forFeature([Todo]),
	],
	controllers: [
		// Register the TodoController to handle HTTP requests related to todos
		TodoController,
	],
	exports: [
		// Export the TodoRepository to make it available to other modules
		TodoRepository,
	],
	providers: [
		// Register use cases as providers for business logic
		ReadAllTodoUseCase,
		ReadTodoUseCase,
		CreateTodoUseCase,
		UpdateTodoUseCase,
		DeleteTodoUseCase,
		// Register the TodoRepository to manage database operations
		TodoRepository,
	],
})
export class TodoModule implements NestModule {
	/**
	 * Optional method to configure middleware for this module.
	 * Currently unused but available for future middleware configuration.
	 * @param _consumer - The MiddlewareConsumer instance for configuring middleware
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	configure(_consumer: MiddlewareConsumer) {}
}
