import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_audit_trails')
@Index('idx-user-audit-trails-user_id', ['user_id'])
@Index('idx-user-audit-trails-entry_at', ['entry_at'])
export class UserAuditTrail {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.user_audit_trails)
	@JoinColumn({ name: 'user_id' })
	user_id: User;

	@Column({ nullable: true })
	entity_name: string;

	@Column({ nullable: true, type: 'text' })
	before_value: string; // BSON will be stored as string

	@Column({ nullable: true, type: 'text' })
	after_value: string; // BSON will be stored as string

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	entry_at?: Date;

	@Column({ nullable: true })
	entry_by: string;
}
