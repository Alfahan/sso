import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TodoRepository } from '@app/modules/v1.0/todos/repositories/todo.repository';
import { Todo } from '@app/entities/todo.entity';
import { ReadAllTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/readAllTodo.usecase';
import { Pagination } from '@app/common/api-response';

describe('Read Use Case', () => {
	let readAllTodoUseCase: ReadAllTodoUseCase;
	let repository: TodoRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReadAllTodoUseCase,
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

		readAllTodoUseCase = module.get<ReadAllTodoUseCase>(ReadAllTodoUseCase);
		repository = module.get<TodoRepository>(TodoRepository);
	});

	describe('readAll', () => {
		it('should call repository.getListPagination with the correct parameters', async () => {
			const page = 1;
			const limit = 10;
			const search = 'test';
			const req: Request = {
				query: { page, limit, search },
			} as any;
			const expectedData = {} as Pagination<Todo>;
			jest.spyOn(repository, 'getListPagination').mockResolvedValue(
				expectedData,
			);

			const result = await readAllTodoUseCase.readAll(req);

			expect(repository.getListPagination).toHaveBeenCalledWith(
				page,
				limit,
				search,
			);
			expect(result).toBe(expectedData);
		});
	});
});
