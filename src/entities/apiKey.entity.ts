import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('api_keys')
@Index('idx-api-keys-third_party_name', ['third_party_name']) // Index for user ID to optimize queries related to users
@Index('idx-api-keys-status', ['status']) // Index for action type to optimize queries based on login actions
export class ApiKey {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	key: string;

	@Column()
	third_party_name: string;

	@Column()
	status: string;

	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;
}
