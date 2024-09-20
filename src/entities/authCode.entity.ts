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
import { ApiKey } from './apiKey.entity';

@Entity('auth_codes')
@Index('idx-auth-codes-user_id', ['user_id'])
@Index('idx-auth-codes-api_key_id', ['api_key_id'])
@Index('idx-auth-codes-otp_code', ['code'])
@Index('idx-auth-codes-status', ['status'])
@Index('idx-auth-codes-ip_origin', ['ip_origin'])
@Index('idx-auth-codes-geolocation', ['geolocation'])
@Index('idx-auth-codes-country', ['country'])
@Index('idx-auth-codes-browser', ['browser'])
@Index('idx-auth-codes-os_type', ['os_type'])
@Index('idx-auth-codes-device', ['device'])
export class AuthCode {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.user_sessions)
	@JoinColumn({ name: 'user_id' })
	user_id: string;

	@ManyToOne(() => ApiKey, (apikey) => apikey.user_sessions)
	@JoinColumn({ name: 'api_key_id' })
	api_key_id: string;

	@Column({ nullable: true })
	code: string;

	@Column({ nullable: true })
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
	expires_at?: Date;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
