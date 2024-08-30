import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * Entity representing a Todo item.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('todos')
@Index('idx-todos-created_at', ['created_at']) // Index for creation timestamp
@Index('idx-todos-updated_at', ['updated_at']) // Index for update timestamp
@Index('idx-todos-deleted_at', ['deleted_at']) // Index for deletion timestamp
export class Todo extends BaseEntity {
	/**
	 * Unique identifier for the Todo item.
	 * This is a UUID that is automatically generated.
	 */
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Title of the Todo item.
	 * This field is required and holds the main text or description of the Todo.
	 */
	@Column()
	title: string;

	/**
	 * Indicates whether the Todo item is completed.
	 * Default value is `false`, meaning the Todo is not completed initially.
	 */
	@Column({ default: false })
	completed: boolean;
}
