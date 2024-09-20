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
import { ApiKey } from './apiKey.entity';

@Entity('user_sessions')
@Index('idx-user-sessions-user_id', ['user_id'])
@Index('idx-user-sessions-api_key_id', ['api_key_id'])
@Index('idx-user-sessions-ip_origin', ['ip_origin'])
@Index('idx-user-sessions-geolocation', ['geolocation'])
@Index('idx-user-sessions-country', ['country'])
@Index('idx-user-sessions-browser', ['browser'])
@Index('idx-user-sessions-os_type', ['os_type'])
@Index('idx-user-sessions-device', ['device'])
export class UserSession {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.user_sessions)
	@JoinColumn({ name: 'user_id' })
	user_id: string;

	@ManyToOne(() => ApiKey, (apikey) => apikey.user_sessions)
	@JoinColumn({ name: 'api_key_id' })
	api_key_id: string;

	@Column()
	token: string;

	@Column()
	refresh_token: string;

	@Column()
	status: string;

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

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
