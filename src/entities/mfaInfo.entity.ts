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

@Entity('mfa_infos')
@Index('idx-mfa-infos-user_id', ['user_id'])
@Index('idx-mfa-infos-otp_code', ['otp_code'])
@Index('idx-mfa-infos-status', ['status'])
export class MfaInfo {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.mfa_infos)
	@JoinColumn({ name: 'user_id' }) // Customizes the foreign key column name
	user_id: User; // Relationship reference to the User entity

	@Column({ nullable: true })
	otp_code: string;

	@Column({ nullable: true })
	status: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	otp_expired_at?: Date;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
