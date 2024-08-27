import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { Todo } from '@app/entities/todo.entity';
import { CreateTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/createTodo.usecase';
import { TodoRepository } from '@app/modules/v1.0/todos/repositories/todo.repository';

describe('Create Use Case', () => {
	let createTodoUseCase: CreateTodoUseCase;
	let repository: TodoRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateTodoUseCase,
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

		createTodoUseCase = module.get<CreateTodoUseCase>(CreateTodoUseCase);
		repository = module.get<TodoRepository>(TodoRepository);
	});

	describe('create', () => {
		it('should call repository.save with the correct data', async () => {
			const req = { body: {} } as Request;
			const res = {
				locals: { logged: { name: 'test-user' } },
			} as unknown as Response<any, Record<string, any>>;
			const expectedData = {} as Todo;
			jest.spyOn(repository, 'save').mockResolvedValue(expectedData);

			const result = await createTodoUseCase.create(req, res);

			expect(repository.save).toHaveBeenCalledWith(req.body);
			expect(result).toBe(expectedData);
		});
	});
});
