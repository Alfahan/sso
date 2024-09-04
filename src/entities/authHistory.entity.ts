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
@Entity('auth_histories')
@Index('idx-auth-histories-user_id', ['user_id']) // Index for user ID to optimize queries related to users
@Index('idx-auth-histories-action_type', ['action_type']) // Index for action type to optimize queries based on login actions
export class AuthHistory {
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
	@ManyToOne(() => User, (user) => user.auth_histories)
	@JoinColumn({ name: 'user_id' }) // Customizes the foreign key column name
	user_id: User; // Relationship reference to the User entity

	/**
	 * IP address from which the login attempt was made.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	ip_origin: string;

	@Column({ nullable: true })
	geolocation: string;

	/**
	 * Country from which the login attempt was made.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	country: string;

	/**
	 * Browser used during the login attempt.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	browser: string;

	/**
	 * Operating System used during the login attempt.
	 * This field is optional.
	 */
	@Column({ nullable: true })
	os_type: string;

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
	action_type: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	action_at?: Date;
}
