import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1728722179636 implements MigrationInterface {
	name = ' $npmConfigName1728722179636';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "internals" ADD CONSTRAINT "UQ_6254be3812ac56f860cde626728" UNIQUE ("nik")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "internals" DROP CONSTRAINT "UQ_6254be3812ac56f860cde626728"`,
		);
	}
}
