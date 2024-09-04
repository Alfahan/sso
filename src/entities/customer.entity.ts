import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity('customers')
@Index('idx-customers-user_id', ['user_id'])
export class Customer extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.user_audit_trails)
	@JoinColumn({ name: 'user_id' }) // Customizes the foreign key column name
	user_id: User; // Relationship reference to the User entity

	@Column({ nullable: true })
	ktp: string;

	@Column({ nullable: true })
	npwp: string;

	@Column({ nullable: true })
	service_model: string;

	@Column({ nullable: true })
	type: string;

	@Column({ nullable: true })
	wapu_type: string;

	@Column({ nullable: true })
	address: string;
}
