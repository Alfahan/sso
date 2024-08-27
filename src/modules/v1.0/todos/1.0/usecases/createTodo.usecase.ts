import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request, Response } from 'express';
@Injectable()
export class CreateTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	async create(req: Request, res: Response) {
		const logged: any = res.locals.logged;
		const body = req.body;
		body.created_by = logged?.user_id ?? 'SYSTEM';
		body.updated_by = logged?.name ?? 'SYSTEM';
		return await this.repository.save(req.body);
	}
}
