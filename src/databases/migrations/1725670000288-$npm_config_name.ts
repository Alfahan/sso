import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1725670000288 implements MigrationInterface {
	name = ' $npmConfigName1725670000288';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "mfa_infos" ADD "status" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "mfa_infos" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ALTER COLUMN "token" DROP NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ALTER COLUMN "status" DROP NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ALTER COLUMN "status" SET NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ALTER COLUMN "token" SET NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "mfa_infos" DROP COLUMN "created_at"`,
		);
		await queryRunner.query(`ALTER TABLE "mfa_infos" DROP COLUMN "status"`);
	}
}
