import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request, Response } from 'express';

@Injectable()
export class DeleteTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	async delete(req: Request, res: Response): Promise<void> {
		const id = req.params.id;
		const logged: any = res.locals.logged;
		const deletedBy: string = logged?.name ?? 'SYSTEM';
		const deletedName: string = logged?.name ?? 'SYSTEM';
		await this.repository.safeDeleteById(id, deletedBy, deletedName);
	}
}
