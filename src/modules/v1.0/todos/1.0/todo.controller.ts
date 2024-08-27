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
