import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('user_tokens')
@Index('idx-user-tokens-user_id', ['user_id'])
export class UserToken extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid', name: 'user_id' })
	@ManyToOne(() => User, (user_id) => user_id.tokens)
	user_id: string;

	@Column()
	token: string;

	@Column()
	status: string;
}
