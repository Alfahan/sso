import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponse } from '@app/common/api-response';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TodoController } from '@app/modules/v1.0/todos/1.0/todo.controller';
import { TodoRepository } from '@app/modules/v1.0/todos/repositories/todo.repository';
import { CreateTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/createTodo.usecase';
import { Todo } from '@app/entities/todo.entity';
import { successCode } from '@app/const/success-message';
import { errorCode } from '@app/const/error-message';
import { ReadAllTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/readAllTodo.usecase';
import { ReadTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/readTodo.usecase';
import { UpdateTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/updateTodo.usecase';
import { DeleteTodoUseCase } from '@app/modules/v1.0/todos/1.0/usecases/deleteTodo.usecase';
import { Request, Response } from 'express';

describe('TodoController', () => {
	let controller: TodoController;
	let createTodoUseCase: CreateTodoUseCase;
	let readTodoUseCase: ReadTodoUseCase;
	let updateTodoUseCase: UpdateTodoUseCase;
	let deleteTodoUseCase: DeleteTodoUseCase;
	let readAllTodoUseCase: ReadAllTodoUseCase;
	let mockDataSource: any;

	const mockEntityManager = {
		find: jest.fn(),
		save: jest.fn(),
	};

	beforeEach(async () => {
		mockDataSource = {
			locals: { name: 'testing' },
			createEntityManager: jest.fn().mockReturnValue(mockEntityManager),
		};
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TodoController],
			providers: [
				ReadAllTodoUseCase,
				ReadTodoUseCase,
				CreateTodoUseCase,
				UpdateTodoUseCase,
				DeleteTodoUseCase,
				TodoRepository,
				{ provide: DataSource, useValue: mockDataSource },
			],
		}).compile();

		controller = module.get<TodoController>(TodoController);
		createTodoUseCase = module.get<CreateTodoUseCase>(CreateTodoUseCase);
		readTodoUseCase = module.get<ReadTodoUseCase>(ReadTodoUseCase);
		readAllTodoUseCase = module.get<ReadAllTodoUseCase>(ReadAllTodoUseCase);
		updateTodoUseCase = module.get<UpdateTodoUseCase>(UpdateTodoUseCase);
		deleteTodoUseCase = module.get<DeleteTodoUseCase>(DeleteTodoUseCase);
	});

	describe('create', () => {
		it('should return a success response with the created data', async () => {
			const req = {} as Request;
			const res = {} as Response;
			const data = {} as Todo;

			jest.spyOn(createTodoUseCase, 'create').mockResolvedValue(data);

			jest.spyOn(ApiResponse, 'success').mockReturnValue(res as any);

			const result = await controller.create(res, req);

			expect(ApiResponse.success).toHaveBeenCalledWith(
				res,
				data,
				successCode.SCDTTD0001,
			);
			expect(result).toBe(res);
		});

		it('should return a fail response with the error message and stack trace', async () => {
			const req = {} as Request;
			const res = {} as Response;
			const error = new Error('Test error');

			jest.spyOn(createTodoUseCase, 'create').mockRejectedValue(error);
			jest.spyOn(ApiResponse, 'fail').mockReturnValue(res as any);

			try {
				await controller.create(res, req);
			} catch (e) {
				expect(ApiResponse.fail).toHaveBeenCalledWith(
					res,
					error.message,
					errorCode.ERPATD0001,
					error.stack,
				);
				expect(e).toBeInstanceOf(Error);
				expect(e.message).toBe(error.message);
				expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		});
	});

	describe('read', () => {
		it('should return a success response with the data returned by the service', async () => {
			// Arrange
			const req = {} as Request;
			const res = {} as Response;
			const data = {
				id: '38bccfa2-fe0c-4ca8-a3e9-4342ae022b54',
			} as Todo;
			jest.spyOn(readTodoUseCase, 'read').mockResolvedValue(data);
			const successSpy = jest.spyOn(ApiResponse, 'success');

			// Act
			const result = await controller.read(res, req);

			// Assert
			expect(successSpy).toHaveBeenCalledWith(
				{},
				data,
				successCode.SCDTTD0003,
			);
			expect(result).toEqual(successSpy.mock.results[0].value);
		});

		it('should return a fail response with the error message and stack trace', async () => {
			// Arrange
			const req = {} as Request;
			const res = {} as Response;
			const error = new Error('test-error');
			jest.spyOn(readTodoUseCase, 'read').mockRejectedValue(error);
			const failSpy = jest.spyOn(ApiResponse, 'fail');

			// Act
			const result = await controller.read(res, req);

			// Assert
			expect(failSpy).toHaveBeenCalledWith(
				{},
				error.message,
				errorCode.ERPATD0004,
				error.stack,
			);
			expect(result).toEqual(failSpy.mock.results[0].value);
		});
	});

	describe('update', () => {
		it('should be success updated data', async () => {
			const req = {} as Request;
			const res = {} as Response;
			const data = {
				id: '38bccfa2-fe0c-4ca8-a3e9-4342ae022b54',
			} as Todo;
			jest.spyOn(updateTodoUseCase, 'update').mockResolvedValue(data);
			const successSpy = jest.spyOn(ApiResponse, 'success');
			const result = await controller.update(res, req);
			expect(successSpy).toHaveBeenCalledWith(
				res,
				data,
				successCode.SCDTTD0002,
			);
			expect(result).toEqual(successSpy.mock.results[0].value);
		});

		it('should return a failed response with the error message and stack trace', async () => {
			// Arrange
			const req = {} as Request;
			const res = {} as Response;
			const error = new Error('test-error');
			jest.spyOn(updateTodoUseCase, 'update').mockRejectedValue(error);
			const failSpy = jest.spyOn(ApiResponse, 'fail');

			const result = await controller.update(res, req);

			expect(failSpy).toHaveBeenCalledWith(
				res,
				error.message,
				errorCode.ERPATD0002,
				error.stack,
			);
			expect(result).toEqual(failSpy.mock.results[0].value);
		});

		it('should throw an HttpException if the error is not an instance of Error', async () => {
			// Arrange
			const req = {} as Request;
			const res = {} as Response;
			const error = 'Http Exception';
			jest.spyOn(updateTodoUseCase, 'update').mockRejectedValue(error);

			try {
				await controller.update(res, req);
			} catch (e) {
				expect(e).toBeInstanceOf(HttpException);
				expect(e.message).toBe(error);
				expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		});
	});

	describe('delete', () => {
		it('should be success deleted data', async () => {
			const id = '38bccfa2-fe0c-4ca8-a3e9-4342ae022b54';
			const req: Request = {
				params: { id },
			} as any;
			const res = {} as Response;
			jest.spyOn(deleteTodoUseCase, 'delete').mockResolvedValue();
			const successSpy = jest.spyOn(ApiResponse, 'success');
			const result = await controller.delete(res, req);

			expect(successSpy).toHaveBeenCalledWith(
				res,
				result,
				successCode.SCDTTD0001,
			);
			expect(result).toEqual(successSpy.mock.results[0].value);
		});

		it('should return a failed response with the error message and stack trace', async () => {
			// Arrange
			const req = {} as Request;
			const res = {} as Response;
			const error = new Error('test-error');
			jest.spyOn(deleteTodoUseCase, 'delete').mockRejectedValue(error);
			const failSpy = jest.spyOn(ApiResponse, 'fail');

			const result = await controller.delete(res, req);

			expect(failSpy).toHaveBeenCalledWith(
				res,
				error.message,
				errorCode.ERPATD0004,
				error.stack,
			);
			expect(result).toEqual(failSpy.mock.results[0].value);
		});

		it('should be throw an HttpException if the error is not an instance of Error', async () => {
			// Arrange
			const req = {} as Request;
			const res = {} as Response;
			const error = 'Http Exception';
			jest.spyOn(deleteTodoUseCase, 'delete').mockRejectedValue(error);

			try {
				await controller.delete(res, req);
			} catch (e) {
				expect(e).toBeInstanceOf(HttpException);
				expect(e.message).toBe(error);
				expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		});
	});

	describe('readAll', () => {
		it('should return a success response with the data returned by the service', async () => {
			const req = {} as Request;
			const res = {} as Response;
			const data = [
				{ id: 'd05f74e5-7677-410b-be15-a23c573fcfc3' },
				{ id: 'd05f74e5-7677-410b-be15-a23c573fcfc4' },
			] as Todo[];
			jest.spyOn(readAllTodoUseCase, 'readAll').mockResolvedValue(
				data as any,
			);
			const successSpy = jest.spyOn(ApiResponse, 'success');

			const result = await controller.readAll(res, req);

			expect(successSpy).toHaveBeenCalledWith(
				{},
				data,
				successCode.SCDTTD0003,
			);
			expect(result).toEqual(successSpy.mock.results[0].value);
		});
		it('should be return a fail response', async () => {
			const req = {} as Request;
			const res = {} as Response;
			const error = new Error('test-error');
			jest.spyOn(readAllTodoUseCase, 'readAll').mockRejectedValue(error);
			const failSpy = jest.spyOn(ApiResponse, 'fail');

			const result = await controller.readAll(res, req);

			expect(failSpy).toHaveBeenCalledWith(
				res,
				error.message,
				errorCode.ERPATD0004,
				error.stack,
			);
			expect(result).toEqual(failSpy.mock.results[0].value);
		});
		it('should throw an exception if the error is not an instance of Error', async () => {
			const req = {} as Request;
			const res = {} as Response;
			const error = 'Http Exception';
			jest.spyOn(readAllTodoUseCase, 'readAll').mockRejectedValue(error);

			try {
				await controller.readAll(res, req);
			} catch (e) {
				expect(e).toBeInstanceOf(HttpException);
				expect(e.message).toBe(error);
				expect(e.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		});
	});
});
