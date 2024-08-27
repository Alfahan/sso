import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request, Response } from 'express';

@Injectable()
export class UpdateTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	async update(req: Request, res: Response) {
		const id = req.params.id;
		const body = req.body;

		const logged: any = res.locals.logged;
		const existingPermission = await this.repository.findById(id);
		body.updated_by = logged?.name ?? 'SYSTEM';

		const updatedPermission = { ...existingPermission, ...body };
		return await this.repository.save(updatedPermission);
	}
}
