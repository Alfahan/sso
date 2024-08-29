import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('login_logs')
@Index('idx-login-logs-user_id', ['user_id'])
@Index('idx-login-logs-action', ['action'])
@Index('idx-login-logs-created_at', ['created_at'])
@Index('idx-login-logs-updated_at', ['updated_at'])
@Index('idx-login-logs-deleted_at', ['deleted_at'])
export class LoginLog extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid', name: 'user_id' })
	@ManyToOne(() => User, (user_id) => user_id.loginLogs)
	user_id: string;

	@Column()
	ip: string;

	@Column()
	os: string;

	@Column()
	browser: string;

	@Column()
	country: string;

	@Column()
	action: string;
}
