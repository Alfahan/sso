import {
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Put,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '@app/common/api-response';
import { successCode } from '@app/const/success-message';
import { errorCode } from '@app/const/error-message';
import { CreateTodoUseCase } from './usecases/createTodo.usecase';
import { ReadTodoUseCase } from './usecases/readTodo.usecase';
import { ReadAllTodoUseCase } from './usecases/readAllTodo.usecase';
import { UpdateTodoUseCase } from './usecases/updateTodo.usecase';
import { DeleteTodoUseCase } from './usecases/deleteTodo.usecase';

@Controller({ path: 'todos', version: '1.0' })
export class TodoController {
	constructor(
		private readonly createTodoUseCase: CreateTodoUseCase,
		private readonly readTodoUseCase: ReadTodoUseCase,
		private readonly readAllTodoUseCase: ReadAllTodoUseCase,
		private readonly updateTodoUseCase: UpdateTodoUseCase,
		private readonly deleteTodoUseCase: DeleteTodoUseCase,
	) {}

	/**
	 * Create a new Todo item
	 * @param res - Express Response object
	 * @param req - Express Request object
	 * @returns - Response with success or error message
	 */
	@Post()
	async create(@Res() res: Response, @Req() req: Request): Promise<Response> {
		try {
			const data = await this.createTodoUseCase.create(req, res);
			return ApiResponse.success(res, data, successCode.SCDTTD0001);
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERPATD0001,
					error.stack,
				);
			}

			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Retrieve a specific Todo item by ID
	 * @param res - Express Response object
	 * @param req - Express Request object
	 * @returns - Response with the requested Todo item or error message
	 */
	@Get('/:id')
	async read(@Res() res: Response, @Req() req: Request): Promise<Response> {
		try {
			const data = await this.readTodoUseCase.read(req);
			return ApiResponse.success(res, data, successCode.SCDTTD0003);
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERPATD0004,
					error.stack,
				);
			}

			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Retrieve all Todo items with optional pagination and search
	 * @param res - Express Response object
	 * @param req - Express Request object
	 * @returns - Response with a list of Todo items or error message
	 */
	@Get()
	async readAll(
		@Res() res: Response,
		@Req() req: Request,
	): Promise<Response> {
		try {
			const data = await this.readAllTodoUseCase.readAll(req);
			return ApiResponse.success(res, data, successCode.SCDTTD0003);
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERPATD0004,
					error.stack,
				);
			}

			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Update a specific Todo item by ID
	 * @param res - Express Response object
	 * @param req - Express Request object
	 * @returns - Response with updated Todo item or error message
	 */
	@Put('/:id')
	async update(@Res() res: Response, @Req() req: Request): Promise<Response> {
		try {
			const data = await this.updateTodoUseCase.update(req, res);
			return ApiResponse.success(res, data, successCode.SCDTTD0002);
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERPATD0002,
					error.stack,
				);
			}

			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	/**
	 * Delete a specific Todo item by ID
	 * @param res - Express Response object
	 * @param req - Express Request object
	 * @returns - Response with success message or error message
	 */
	@Delete('/:id')
	async delete(@Res() res: Response, @Req() req: Request): Promise<Response> {
		try {
			const data = await this.deleteTodoUseCase.delete(req, res);
			return ApiResponse.success(res, data, successCode.SCDTTD0004);
		} catch (error) {
			if (error instanceof Error) {
				return ApiResponse.fail(
					res,
					error.message,
					errorCode.ERPATD0004,
					error.stack,
				);
			}

			throw new HttpException(
				error.message,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
