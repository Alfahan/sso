import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	Index,
} from 'typeorm';
import { UserToken } from './userToken.entity';
import { LoginLog } from './loginLog.entity';
import { BaseEntity } from './base.entity';

@Entity('users')
@Index('idx-users-email', ['email'])
@Index('idx-users-no_phone', ['no_phone'])
@Index('idx-users-created_at', ['created_at'])
@Index('idx-users-updated_at', ['updated_at'])
@Index('idx-users-deleted_at', ['deleted_at'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	no_phone: string;

	@Column()
	status: string;

	@OneToMany(() => UserToken, (userToken) => userToken.user_id)
	tokens: UserToken[];

	@OneToMany(() => LoginLog, (loginLog) => loginLog.user_id)
	loginLogs: LoginLog[];
}
