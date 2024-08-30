import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request, Response } from 'express';

@Injectable()
export class DeleteTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	/**
	 * Soft delete a Todo item by its ID
	 * @param req - Express Request object containing the Todo ID in the route parameters
	 * @param res - Express Response object used to access local variables
	 * @returns - A promise that resolves when the delete operation is complete
	 */
	async delete(req: Request, res: Response): Promise<void> {
		// Extract the Todo ID from route parameters
		const id = req.params.id;

		// Access logged user information from the response's locals
		const logged: any = res.locals.logged;

		// Set deleted_by and deleted_name fields based on logged user or default to 'SYSTEM'
		const deletedBy: string = logged?.name ?? 'SYSTEM';
		const deletedName: string = logged?.name ?? 'SYSTEM';

		// Perform the soft delete operation using the repository
		await this.repository.safeDeleteById(id, deletedBy, deletedName);
	}
}
