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
		super(Todo, datasource.createEntityManager());
	}

	/**
	 * List
	 * @param page
	 * @param limit
	 * @param search
	 * @returns
	 */
	async getListPagination(
		page: number = 1,
		limit: number = 10,
		search: any = null,
	): Promise<Pagination<Todo>> {
		const skip = (page - 1) * limit;
		const options: FindManyOptions<Todo> = { skip, take: limit, where: {} };

		if (search) {
			options.where['name'] = ILike(`%${search}%`);
		}

		const [data, total_items] = await this.findAndCount(options);
		const total_page = Math.ceil(total_items / limit);
		const total_data = await this.getTotalData();
		return new Pagination<Todo>(data, {
			per_page: limit,
			current_page: page,
			total_page,
			total_filtered: data.length,
			total: total_data,
		} as FABDMetaResponse);
	}

	/**
	 * Total Data
	 * @returns Number
	 */
	async getTotalData(): Promise<number> {
		return await this.count();
	}

	/**
	 * Find by Id
	 * @param id
	 * @returns
	 */
	async findById(id: string): Promise<Todo> {
		const options: FindOneOptions<Todo> = { where: { id } };
		return await this.findOne(options);
	}

	/**
	 * Soft Delete
	 * @param id
	 * @returns
	 */
	async safeDeleteById(
		id: string,
		deleted_by: string,
		deleted_name: string,
	): Promise<Todo> {
		const data = await this.findById(id);
		this.softDelete(id);
		data.deleted_by = deleted_by;
		data.deleted_name = deleted_name;
		return await this.save(data);
	}
}
