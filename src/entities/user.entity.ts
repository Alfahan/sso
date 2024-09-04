import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	Index,
} from 'typeorm';
import { UserToken } from './userToken.entity';
import { AuthHistory } from './authHistory.entity';
import { BaseEntity } from './base.entity';
import { UserResetPassword } from './userResetPassword.entity';
import { UserAuditTrail } from './userAuditTrail.entity';
import { MfaInfo } from './mfaInfo.entity';

/**
 * Entity representing a user in the system.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('users')
@Index('idx-users-username', ['username']) // Index for user email
@Index('idx-users-email', ['email']) // Index for user email
@Index('idx-users-phone_number', ['phone_number']) // Index for user phone number
@Index('idx-users-status', ['status']) // Index for user phone number
@Index('idx-users-created_at', ['created_at']) // Index for creation timestamp
@Index('idx-users-updated_at', ['updated_at']) // Index for update timestamp
@Index('idx-users-deleted_at', ['deleted_at']) // Index for deletion timestamp
export class User extends BaseEntity {
	/**
	 * Unique identifier for the User.
	 * This is a UUID that is automatically generated.
	 */
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	/**
	 * Phone number of the User.
	 * This field is required and indexed for quick lookups.
	 */
	@Column()
	phone_number: string;

	/**
	 * Email address of the User.
	 * This field is required and indexed for quick lookups.
	 */
	@Column()
	email: string;

	/**
	 * Password for the User account.
	 * This field is required for authentication.
	 */
	@Column()
	password: string;

	/**
	 * Status of the User account.
	 * Can be used to indicate whether the account is active, inactive, etc.
	 */
	@Column({ nullable: true })
	status: string;

	@Column({ nullable: true })
	segment: string;

	@Column({ nullable: true })
	failed_login_attempts: number;

	/**
	 * One-to-many relationship with UserToken.
	 * Represents all tokens associated with the user.
	 */
	@OneToMany(() => UserToken, (user_tokens) => user_tokens.user_id)
	user_tokens: UserToken[];

	/**
	 * One-to-many relationship with ActivityLog.
	 * Represents all login logs associated with the user.
	 */
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
