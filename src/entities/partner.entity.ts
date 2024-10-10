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

@Entity('partners')
@Index('idx-partners-ecosystem_id', ['ecosystem_id'])
@Index('idx-partners-ecosystem_name', ['ecosystem_name'])
export class Partner extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => User, (user) => user.partner)
	@JoinColumn({ name: 'user_id' })
	user_id: User;

	@Column({ nullable: true })
	ecosystem_id: string;

	@Column({ nullable: true })
	ecosystem_name: string;

	@Column({ default: true })
	is_ecosystem_owner: boolean;
}
