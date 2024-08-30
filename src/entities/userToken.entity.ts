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
 * Entity representing a user token.
 * Inherits common fields from the BaseEntity class.
 */
@Entity('user_tokens')
@Index('idx-user-tokens-user_id', ['user_id']) // Index for user ID to optimize queries related to tokens by user
export class UserToken extends BaseEntity {
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
	@ManyToOne(() => User, (user) => user.tokens)
	@JoinColumn({ name: 'user_id' }) // Customizes the foreign key column name
	user_id: string; // Foreign key to the User entity, represented as a string

	/**
	 * Token string associated with the user.
	 * This field stores the token value.
	 */
	@Column()
	token: string;

	/**
	 * Status of the token.
	 * Represents the current status of the token (e.g., valid, expired).
	 */
	@Column()
	status: string;
}
