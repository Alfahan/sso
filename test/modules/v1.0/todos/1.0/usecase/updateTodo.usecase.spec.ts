import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { TodoRepository } from '@app/modules/v1.0/todos/repositories/todo.repository';
import { Todo } from '@app/entities/todo.entity';
import { UpdateTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/updateTodo.usecase';

describe('Update Use Case', () => {
	let updateTodoUseCase: UpdateTodoUseCase;
	let repository: TodoRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateTodoUseCase,
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

		updateTodoUseCase = module.get<UpdateTodoUseCase>(UpdateTodoUseCase);
		repository = module.get<TodoRepository>(TodoRepository);
	});

	describe('update', () => {
		it('should call repository.save with the updated data', async () => {
			const id = 'test-id';
			const req: Request = {
				params: { id },
				body: {},
			} as any;
			const res = {
				locals: { logged: { name: 'test-user' } },
			} as unknown as Response<any, Record<string, any>>;
			const existingTodo = {} as Todo;
			const updatedTodo = {
				updated_by: 'test-user',
			} as Todo;
			jest.spyOn(repository, 'findById').mockResolvedValue(existingTodo);
			jest.spyOn(repository, 'save').mockResolvedValue(updatedTodo);

			const result = await updateTodoUseCase.update(req, res);

			expect(repository.findById).toHaveBeenCalledWith(id);
			expect(repository.save).toHaveBeenCalledWith(updatedTodo);
			expect(result).toBe(updatedTodo);
		});
	});
});
