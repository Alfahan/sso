import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	Index,
	OneToOne,
	Unique,
} from 'typeorm';
import { UserSession } from './userSession.entity';
import { AuthHistory } from './authHistory.entity';
import { BaseEntity } from './base.entity';
import { UserResetPassword } from './userResetPassword.entity';
import { UserAuditTrail } from './userAuditTrail.entity';
import { MfaInfo } from './mfaInfo.entity';
import CryptoTs from 'pii-agent-ts';
import { Internal } from './Internal.entity';
import { Partner } from './partner.entity';
import { Customer } from './customer.entity';

@Entity('users')
@Unique(['username'])
@Index('idx-users-username', ['username'])
@Unique(['username_bidx'])
@Index('idx-users-username_bidx', ['username_bidx'])
@Unique(['email'])
@Index('idx-users-email', ['email'])
@Unique(['email_bidx'])
@Index('idx-users-email_bidx', ['email_bidx'])
@Unique(['phone'])
@Index('idx-users-phone', ['phone'])
@Unique(['phone_bidx'])
@Index('idx-users-phone_bidx', ['phone_bidx'])
@Index('idx-users-status', ['status'])
@Index('idx-users-created_at', ['created_at'])
@Index('idx-users-updated_at', ['updated_at'])
@Index('idx-users-deleted_at', ['deleted_at'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('username')
	@CryptoTs.BidxCol('username_bidx')
	@CryptoTs.TxtHeapTable('username_text_heap')
	username: string;

	@Column({ nullable: true })
	username_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('phone')
	@CryptoTs.BidxCol('phone_bidx')
	@CryptoTs.TxtHeapTable('phone_text_heap')
	phone: string;

	@Column({ nullable: true })
	phone_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('email')
	@CryptoTs.BidxCol('email_bidx')
	@CryptoTs.TxtHeapTable('email_text_heap')
	email: string;

	@Column({ nullable: true })
	email_bidx: string;

	@Column({ nullable: true })
	password: string;

	@Column({ nullable: true })
	status: string;

	@Column({ nullable: true })
	segment: string; // Customer, Partner, Account Manager, Internal

	@OneToMany(() => UserSession, (user_sessions) => user_sessions.user_id)
	user_sessions: UserSession[];

	@OneToMany(() => AuthHistory, (auth_histories) => auth_histories.user_id)
	auth_histories: AuthHistory[];

	@OneToMany(
		() => UserResetPassword,
		(user_reset_passwords) => user_reset_passwords.user_id,
	)
	user_reset_passwords: UserResetPassword[];

	@OneToMany(
		() => UserAuditTrail,
		(user_audit_trails) => user_audit_trails.user_id,
	)
	user_audit_trails: UserAuditTrail[];

	@OneToMany(() => MfaInfo, (mfa_infos) => mfa_infos.user_id)
	mfa_infos: MfaInfo[];

	@OneToOne(() => Internal, (internal) => internal.user_id)
	internal: Internal;

	@OneToOne(() => Partner, (partner) => partner.user_id)
	partner: Partner;

	@OneToOne(() => Customer, (customer) => customer.user_id)
	customer: Customer;
}
