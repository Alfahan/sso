import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_reset_passwords')
@Index('idx-user-token-user_id', ['user_id'])
@Index('idx-user-token-status', ['status'])
export class UserResetPassword {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.user_reset_passwords)
	@JoinColumn({ name: 'user_id' })
	user_id: string;

	@Column()
	token: string;

	@Column()
	status: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
