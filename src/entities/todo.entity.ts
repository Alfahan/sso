import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('todos')
@Index('idx-todos-created_at', ['created_at'])
@Index('idx-todos-updated_at', ['updated_at'])
@Index('idx-todos-deleted_at', ['deleted_at'])
export class Todo extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column({ default: false })
	completed: boolean;
}
