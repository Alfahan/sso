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
@Index('idx-user-reset-passwords-user_id', ['user_id'])
@Index('idx-user-reset-passwords-status', ['status'])
export class UserResetPassword {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.user_reset_passwords)
	@JoinColumn({ name: 'user_id' })
	user_id: string;

	@Column({ nullable: true })
	token: string;

	@Column({ nullable: true })
	status: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
