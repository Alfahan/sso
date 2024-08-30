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

/**
 * Entity representing a user in the system.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('users')
@Index('idx-users-email', ['email']) // Index for user email
@Index('idx-users-no_phone', ['no_phone']) // Index for user phone number
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
	 * Phone number of the User.
	 * This field is required and indexed for quick lookups.
	 */
	@Column()
	no_phone: string;

	/**
	 * Status of the User account.
	 * Can be used to indicate whether the account is active, inactive, etc.
	 */
	@Column()
	status: string;

	/**
	 * One-to-many relationship with UserToken.
	 * Represents all tokens associated with the user.
	 */
	@OneToMany(() => UserToken, (userToken) => userToken.user_id)
	tokens: UserToken[];

	/**
	 * One-to-many relationship with LoginLog.
	 * Represents all login logs associated with the user.
	 */
	@OneToMany(() => LoginLog, (loginLog) => loginLog.user_id)
	loginLogs: LoginLog[];
}
