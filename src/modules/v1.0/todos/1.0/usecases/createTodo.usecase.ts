import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request, Response } from 'express';

@Injectable()
export class CreateTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	/**
	 * Create a new Todo item
	 * @param req - Express Request object containing the Todo data in the body
	 * @param res - Express Response object used to access local variables
	 * @returns - The created Todo item
	 */
	async create(req: Request, res: Response) {
		// Access logged user information from the response's locals
		const logged: any = res.locals.logged;

		// Extract the request body containing Todo data
		const body = req.body;

		// Set created_by and updated_by fields based on logged user or default to 'SYSTEM'
		body.created_by = logged?.user_id ?? 'SYSTEM';
		body.updated_by = logged?.name ?? 'SYSTEM';

		// Save the new Todo item to the repository and return the result
		return await this.repository.save(req.body);
	}
}
