import {
	Column,
	Entity,
	Index,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('internals')
@Index('idx-internals-user_id', ['user_id'])
@Index('idx-internals-nik', ['nik'])
export class Internal extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => User, (user) => user.internal)
	@JoinColumn({ name: 'user_id' })
	user_id: User;

	@Column({ nullable: true })
	nik: string;

	@Column({ nullable: true })
	position: string;

	@Column({ nullable: true })
	directorate: string;

	@Column({ nullable: true })
	division: string;

	@Column({ nullable: true })
	unit: string;

	@Column({ nullable: true })
	employee_status: string;
}
