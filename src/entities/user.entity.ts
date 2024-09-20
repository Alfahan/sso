import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	Index,
} from 'typeorm';
import { UserSession } from './userSession.entity';
import { AuthHistory } from './authHistory.entity';
import { BaseEntity } from './base.entity';
import { UserResetPassword } from './userResetPassword.entity';
import { UserAuditTrail } from './userAuditTrail.entity';
import { MfaInfo } from './mfaInfo.entity';

@Entity('users')
@Index('idx-users-username', ['username'])
@Index('idx-users-email', ['email'])
@Index('idx-users-phone_number', ['phone_number'])
@Index('idx-users-status', ['status'])
@Index('idx-users-created_at', ['created_at'])
@Index('idx-users-updated_at', ['updated_at'])
@Index('idx-users-deleted_at', ['deleted_at'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	phone_number: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	status: string;

	@Column({ nullable: true })
	segment: string;

	@Column({ nullable: true })
	failed_login_attempts: number;

	@OneToMany(() => UserSession, (user_sessions) => user_sessions.user_id)
	user_sessions: UserSession[];

	@OneToMany(() => AuthHistory, (auth_histories) => auth_histories.user_id)
	auth_histories: AuthHistory[];

	@OneToMany(
		() => UserResetPassword,
		(user_reset_passwords) => user_reset_passwords.user_id,
	)
	user_reset_passwords: UserResetPassword[];

	@OneToMany(
		() => UserAuditTrail,
		(user_audit_trails) => user_audit_trails.user_id,
	)
	user_audit_trails: UserAuditTrail[];

	@OneToMany(() => MfaInfo, (mfa_infos) => mfa_infos.user_id)
	mfa_infos: MfaInfo[];
}
