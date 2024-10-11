import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1728617619567 implements MigrationInterface {
	name = ' $npmConfigName1728617619567';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
		);
	}
}
