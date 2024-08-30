import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request } from 'express';

@Injectable()
export class ReadTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	/**
	 * Retrieve a Todo item by its ID
	 * @param req - Express Request object containing the Todo item ID in the URL parameters
	 * @returns - A promise that resolves to the Todo item corresponding to the provided ID
	 */
	async read(req: Request) {
		// Extract the Todo item ID from the request URL parameters
		const id = req.params.id;

		// Retrieve the Todo item from the repository by its ID
		const data = await this.repository.findById(id);

		// Return the retrieved Todo item
		return data;
	}
}
