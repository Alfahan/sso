import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request } from 'express';

@Injectable()
export class ReadAllTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	async readAll(req: Request) {
		const { page, limit, search }: any = req.query;
		return await this.repository.getListPagination(page, limit, search);
	}
}
