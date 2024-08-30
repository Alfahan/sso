import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request, Response } from 'express';

@Injectable()
export class UpdateTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	/**
	 * Update a Todo item by its ID
	 * @param req - Express Request object containing the Todo item ID in the URL parameters and the updated data in the body
	 * @param res - Express Response object used to access logged-in user information
	 * @returns - A promise that resolves to the updated Todo item
	 */
	async update(req: Request, res: Response) {
		// Extract the Todo item ID from the request URL parameters
		const id = req.params.id;

		// Extract the updated data from the request body
		const body = req.body;

		// Access the logged-in user's information from response locals
		const logged: any = res.locals.logged;

		// Retrieve the existing Todo item from the repository by its ID
		const existingTodo = await this.repository.findById(id);

		// Update the 'updated_by' field with the logged-in user's name or default to 'SYSTEM'
		body.updated_by = logged?.name ?? 'SYSTEM';

		// Merge the existing Todo item with the updated data
		const updatedTodo = { ...existingTodo, ...body };

		// Save and return the updated Todo item
		return await this.repository.save(updatedTodo);
	}
}
