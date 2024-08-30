import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

/**
 * Entity representing a login log entry.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('login_logs')
@Index('idx-login-logs-user_id', ['user_id']) // Index for user ID to optimize queries related to users
@Index('idx-login-logs-action', ['action']) // Index for action type to optimize queries based on login actions
@Index('idx-login-logs-created_at', ['created_at']) // Index for creation timestamp
@Index('idx-login-logs-updated_at', ['updated_at']) // Index for update timestamp
@Index('idx-login-logs-deleted_at', ['deleted_at']) // Index for deletion timestamp
export class LoginLog extends BaseEntity {
	/**
	 * Unique identifier for the LoginLog.
	 * This is a UUID that is automatically generated.
	 */
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Many-to-one relationship with the User entity.
	 * Represents the user associated with this login log entry.
	 * The foreign key column in the database is named 'user_id'.
	 */
	@ManyToOne(() => User, (user) => user.loginLogs)
	@JoinColumn({ name: 'user_id' }) // Customizes the foreign key column name
	user_id: User; // Relationship reference to the User entity

	/**
	 * IP address from which the login attempt was made.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	ip: string;

	/**
	 * Operating System used during the login attempt.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	os: string;

	/**
	 * Browser used during the login attempt.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	browser: string;

	/**
	 * Country from which the login attempt was made.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	country: string;

	/**
	 * Device used during the login attempt.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	device: string;

	/**
	 * Action performed during the login attempt.
	 * This could be 'login', 'logout', etc.
	 */
	@Column()
	action: string;
}
