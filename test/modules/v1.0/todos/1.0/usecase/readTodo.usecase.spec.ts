import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TodoRepository } from '@app/modules/v1.0/todos/repositories/todo.repository';
import { ReadTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/readTodo.usecase';
import { Todo } from '@app/entities/todo.entity';

describe('Read Use Case', () => {
	let readTodoUseCase: ReadTodoUseCase;
	let repository: TodoRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReadTodoUseCase,
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

		readTodoUseCase = module.get<ReadTodoUseCase>(ReadTodoUseCase);
		repository = module.get<TodoRepository>(TodoRepository);
	});

	describe('read', () => {
		it('should call repository.findById with the correct id', async () => {
			const id = 'test-id';
			const req: Request = {
				params: { id },
				get: jest.fn(),
				header: jest.fn(),
				accepts: jest.fn(),
				acceptsCharsets: jest.fn(),
				acceptsEncodings: jest.fn(),
				acceptsLanguages: jest.fn(),
				range: jest.fn(),
			} as any;
			const expectedData = {} as Todo;
			jest.spyOn(repository, 'findById').mockResolvedValue(expectedData);

			const result = await readTodoUseCase.read(req);

			expect(repository.findById).toHaveBeenCalledWith(id);
			expect(result).toBe(expectedData);
		});
	});
});
