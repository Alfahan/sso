import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../repositories/todo.repository';
import { Request } from 'express';

@Injectable()
export class ReadAllTodoUseCase {
	private readonly repository: TodoRepository;

	constructor(repository: TodoRepository) {
		this.repository = repository;
	}

	/**
	 * Retrieve a paginated list of Todo items with optional search functionality
	 * @param req - Express Request object containing query parameters for pagination and search
	 * @returns - A promise that resolves to the paginated list of Todo items
	 */
	async readAll(req: Request) {
		// Extract pagination and search parameters from query
		const { page, limit, search }: any = req.query;

		// Retrieve the paginated list of Todo items from the repository
		return await this.repository.getListPagination(page, limit, search);
	}
}
