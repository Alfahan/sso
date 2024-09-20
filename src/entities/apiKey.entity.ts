import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserSession } from './userSession.entity';

@Entity('api_keys')
@Index('idx-api-keys-name', ['name'])
@Index('idx-api-keys-key', ['key'])
@Index('idx-api-keys-status', ['status'])
export class ApiKey {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	key: string;

	@Column({ nullable: true })
	domain: string;

	@Column({ nullable: true })
	ip_origin: string;

	@Column()
	status: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;

	@OneToMany(() => UserSession, (user_sessions) => user_sessions.api_key_id)
	user_sessions: UserSession[];
}
