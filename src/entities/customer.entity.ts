import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	Index,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';
import CryptoTs from 'pii-agent-ts';

@Entity('customers')
@Index('idx-customers-user_id', ['user_id'])
@Index('idx-customers-ktp', ['ktp'])
@Index('idx-customers-ktp_bidx', ['ktp_bidx'])
@Index('idx-customers-npwp', ['npwp'])
@Index('idx-customers-npwp_bidx', ['npwp_bidx'])
@Index('idx-customers-address', ['address'])
@Index('idx-customers-address_bidx', ['address_bidx'])
@Index('idx-customers-created_at', ['created_at'])
@Index('idx-customers-updated_at', ['updated_at'])
@Index('idx-customers-deleted_at', ['deleted_at'])
export class Customer extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.customer)
	@JoinColumn({ name: 'user_id' })
	user_id: User;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('ktp')
	@CryptoTs.BidxCol('ktp_bidx')
	@CryptoTs.TxtHeapTable('ktp_text_heap')
	ktp: string;

	@Column({ nullable: true })
	ktp_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('npwp')
	@CryptoTs.BidxCol('npwp_bidx')
	@CryptoTs.TxtHeapTable('npwp_text_heap')
	npwp: string;

	@Column({ nullable: true })
	npwp_bidx: string;

	@Column({ nullable: true })
	service_model: string; // Free, Premium

	@Column({ nullable: true })
	type: string; // Retail, Individual, Corporate

	@Column({ nullable: true })
	wapu_type: string; // Private Enterprise, Government

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('address')
	@CryptoTs.BidxCol('address_bidx')
	@CryptoTs.TxtHeapTable('address_text_heap')
	address: string;

	@Column({ nullable: true })
	address_bidx: string;
}
