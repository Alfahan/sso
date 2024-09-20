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

@Entity('auth_histories')
@Index('idx-auth-histories-user_id', ['user_id'])
@Index('idx-auth-histories-action_type', ['action_type'])
export class AuthHistory {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.auth_histories)
	@JoinColumn({ name: 'user_id' })
	user_id: User;

	@Column({ nullable: true })
	ip_origin: string;

	@Column({ nullable: true })
	geolocation: string;

	@Column({ nullable: true })
	country: string;

	@Column({ nullable: true })
	browser: string;

	@Column({ nullable: true })
	os_type: string;

	@Column({ nullable: true })
	device: string;

	@Column()
	action_type: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	action_at?: Date;
}
