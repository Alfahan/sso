import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request } from 'express';

@Injectable()
export class ReadTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	async read(req: Request) {
		const id = req.params.id;
		const data = await this.repository.findById(id);
		return data;
	}
}
