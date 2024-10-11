import {
	Column,
	Entity,
	Index,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import CryptoTs from 'pii-agent-ts';

@Entity('internals')
@Index('idx-internals-user_id', ['user_id'])
@Index('idx-internals-nik', ['nik'])
@Index('idx-internals-nik_bidx', ['nik_bidx'])
@Index('idx-internals-position', ['position'])
@Index('idx-internals-position_bidx', ['position_bidx'])
@Index('idx-internals-directorate', ['directorate'])
@Index('idx-internals-directorate_bidx', ['directorate_bidx'])
@Index('idx-internals-division', ['division'])
@Index('idx-internals-division_bidx', ['division_bidx'])
@Index('idx-internals-unit', ['unit'])
@Index('idx-internals-unit_bidx', ['unit_bidx'])
@Index('idx-internals-created_at', ['created_at'])
@Index('idx-internals-updated_at', ['updated_at'])
@Index('idx-internals-deleted_at', ['deleted_at'])
export class Internal extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => User, (user) => user.internal)
	@JoinColumn({ name: 'user_id' })
	user_id: User;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('nik')
	@CryptoTs.BidxCol('nik_bidx')
	@CryptoTs.TxtHeapTable('nik_text_heap')
	nik: string;

	@Column({ nullable: true })
	nik_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('position')
	@CryptoTs.BidxCol('position_bidx')
	@CryptoTs.TxtHeapTable('position_text_heap')
	position: string;

	@Column({ nullable: true })
	position_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('directorate')
	@CryptoTs.BidxCol('directorate_bidx')
	@CryptoTs.TxtHeapTable('directorate_text_heap')
	directorate: string;

	@Column({ nullable: true })
	directorate_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('division')
	@CryptoTs.BidxCol('division_bidx')
	@CryptoTs.TxtHeapTable('division_text_heap')
	division: string;

	@Column({ nullable: true })
	division_bidx: string;

	@Column({ type: 'bytea', nullable: true })
	@CryptoTs.DBColumn('unit')
	@CryptoTs.BidxCol('unit_bidx')
	@CryptoTs.TxtHeapTable('unit_text_heap')
	unit: string;

	@Column({ nullable: true })
	unit_bidx: string;

	@Column({ nullable: true })
	employee_status: string; // NIK, Non-NIK
}
