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
 * Entity representing a user token.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('user_sessions')
@Index('idx-user-sessions-user_id', ['user_id']) // Index for user ID to optimize queries related to tokens by user
@Index('idx-user-sessions-status', ['status']) // Index for user ID to optimize queries related to tokens by user
@Index('idx-user-sessions-ip_origin', ['ip_origin'])
@Index('idx-user-sessions-geolocation', ['geolocation'])
@Index('idx-user-sessions-country', ['country'])
@Index('idx-user-sessions-browser', ['browser'])
@Index('idx-user-sessions-os_type', ['os_type'])
@Index('idx-user-sessions-device', ['device'])
export class UserSession {
	/**
	 * Unique identifier for the UserToken.
	 * This is a UUID that is automatically generated.
	 */
	@PrimaryGeneratedColumn('uuid')
	id: string;

	/**
	 * Many-to-one relationship with the User entity.
	 * Represents the user associated with this token.
	 * The foreign key column in the database is named 'user_id'.
	 */
	@ManyToOne(() => User, (user) => user.user_sessions)
	@JoinColumn({ name: 'user_id' }) // Customizes the foreign key column name
	user_id: string; // Foreign key to the User entity, represented as a string

	/**
	 * Token string associated with the user.
	 * This field stores the token value.
	 */
	@Column()
	token: string;

	@Column()
	refresh_token: string;

	/**
	 * Status of the token.
	 * Represents the current status of the token (e.g., valid, expired).
	 */
	@Column()
	status: string;

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

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
