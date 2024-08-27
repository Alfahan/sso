import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { TodoRepository } from '@app/modules/v1.0/todos/repositories/todo.repository';
import { DeleteTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/deleteTodo.usecase';

describe('Delete Use Case', () => {
	let deleteTodoUseCase: DeleteTodoUseCase;
	let repository: TodoRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteTodoUseCase,
				{
					provide: TodoRepository,
					useValue: {
						findById: jest.fn(),
						getListPagination: jest.fn(),
						save: jest.fn(),
						safeDeleteById: jest.fn(),
					},
				},
			],
		}).compile();

		deleteTodoUseCase = module.get<DeleteTodoUseCase>(DeleteTodoUseCase);
		repository = module.get<TodoRepository>(TodoRepository);
	});

	describe('delete', () => {
		it('should call repository.safeDeleteById with the correct parameters', async () => {
			const id = 'test-id';
			const req: Request = { params: { id } } as any;
			const res = {
				locals: { logged: { name: 'test-user' } },
			} as unknown as Response<any, Record<string, any>>;

			await deleteTodoUseCase.delete(req, res);

			expect(repository.safeDeleteById).toHaveBeenCalledWith(
				id,
				'test-user',
				'test-user',
			);
		});
	});
});
