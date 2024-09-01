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

/**
 * Entity representing a login log entry.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('activity_logs')
@Index('idx-login-logs-user_id', ['user_id']) // Index for user ID to optimize queries related to users
@Index('idx-login-logs-action', ['action']) // Index for action type to optimize queries based on login actions
export class ActivityLog {
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
	@ManyToOne(() => User, (user) => user.activityLog)
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

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
