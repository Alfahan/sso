import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @Column({
    type: 'timestamp without time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn()
  created_at?: Date;

  @Column({ default: '1' })
  created_by: string;

  @Column({ default: 'System' })
  created_name: string;

  @UpdateDateColumn({ nullable: true })
  updated_at?: Date;

  @Column({ nullable: true })
  updated_by?: string;

  @Column({ nullable: true })
  updated_name?: string;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @Column({ nullable: true })
  deleted_by?: string;

  @Column({ nullable: true })
  deleted_name?: string;
}
