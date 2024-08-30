import { Pagination } from '@app/common/api-response';
import FABDMetaResponse from '@app/common/api-response/interfaces/fabd-meta.interface';
import { Todo } from '@app/entities/todo.entity';
import { Injectable } from '@nestjs/common';
import {
	DataSource,
	FindManyOptions,
	FindOneOptions,
	ILike,
	Repository,
} from 'typeorm';

@Injectable()
export class TodoRepository extends Repository<Todo> {
	constructor(private datasource: DataSource) {
		// Initialize the repository with the Todo entity and the entity manager
		super(Todo, datasource.createEntityManager());
	}

	/**
	 * Retrieves a paginated list of todos with optional search functionality.
	 * @param page - The page number to retrieve (default is 1).
	 * @param limit - The number of items per page (default is 10).
	 * @param search - Optional search term to filter todos by name.
	 * @returns A Pagination object containing the list of todos and metadata.
	 */
	async getListPagination(
		page: number = 1,
		limit: number = 10,
		search: any = null,
	): Promise<Pagination<Todo>> {
		const skip = (page - 1) * limit;
		const options: FindManyOptions<Todo> = { skip, take: limit, where: {} };

		// Apply search filter if provided
		if (search) {
			options.where['name'] = ILike(`%${search}%`);
		}

		const [data, total_items] = await this.findAndCount(options);
		const total_page = Math.ceil(total_items / limit);
		const total_data = await this.getTotalData();

		// Return a Pagination object with todos and metadata
		return new Pagination<Todo>(data, {
			per_page: limit,
			current_page: page,
			total_page,
			total_filtered: data.length,
			total: total_data,
		} as FABDMetaResponse);
	}

	/**
	 * Counts the total number of todos in the repository.
	 * @returns The total number of todos.
	 */
	async getTotalData(): Promise<number> {
		return await this.count();
	}

	/**
	 * Finds a todo by its ID.
	 * @param id - The ID of the todo to find.
	 * @returns The todo with the specified ID.
	 */
	async findById(id: string): Promise<Todo> {
		const options: FindOneOptions<Todo> = { where: { id } };
		return await this.findOne(options);
	}

	/**
	 * Soft deletes a todo by its ID, marking it as deleted without removing it from the database.
	 * @param id - The ID of the todo to delete.
	 * @param deleted_by - The identifier of the user who deleted the todo.
	 * @param deleted_name - The name of the user who deleted the todo.
	 * @returns The updated todo with deletion information.
	 */
	async safeDeleteById(
		id: string,
		deleted_by: string,
		deleted_name: string,
	): Promise<Todo> {
		const data = await this.findById(id);
		await this.softDelete(id); // Perform soft delete operation
		data.deleted_by = deleted_by;
		data.deleted_name = deleted_name;
		return await this.save(data); // Save updated todo with deletion info
	}
}
