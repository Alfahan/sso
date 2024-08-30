import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
} from 'typeorm';

/**
 * Base Entity class for common database fields.
 * This class can be extended by other entity classes to include common fields
 * related to creation, update, and deletion metadata.
 */
export class BaseEntity {
	/**
	 * The timestamp when the record was created.
	 * Automatically set to the current timestamp when the record is created.
	 */
	@Column({
		type: 'timestamp without time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	@CreateDateColumn()
	created_at?: Date;

	/**
	 * The identifier of the user who created the record.
	 * This field is set to a default value of '1' if not provided.
	 */
	@Column({ default: '1' })
	created_by: string;

	/**
	 * The name of the user who created the record.
	 * This field is set to a default value of 'System' if not provided.
	 */
	@Column({ default: 'System' })
	created_name: string;

	/**
	 * The timestamp when the record was last updated.
	 * This field is nullable and will be set to the current timestamp when the record is updated.
	 */
	@UpdateDateColumn({ nullable: true })
	updated_at?: Date;

	/**
	 * The identifier of the user who last updated the record.
	 * This field is nullable and can be set when the record is updated.
	 */
	@Column({ nullable: true })
	updated_by?: string;

	/**
	 * The name of the user who last updated the record.
	 * This field is nullable and can be set when the record is updated.
	 */
	@Column({ nullable: true })
	updated_name?: string;

	/**
	 * The timestamp when the record was deleted.
	 * This field is nullable and will be set when the record is deleted (soft delete).
	 */
	@DeleteDateColumn({ nullable: true })
	deleted_at?: Date;

	/**
	 * The identifier of the user who deleted the record.
	 * This field is nullable and can be set when the record is deleted (soft delete).
	 */
	@Column({ nullable: true })
	deleted_by?: string;

	/**
	 * The name of the user who deleted the record.
	 * This field is nullable and can be set when the record is deleted (soft delete).
	 */
	@Column({ nullable: true })
	deleted_name?: string;
}
