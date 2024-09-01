import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('api_keys')
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
