import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1725670092256 implements MigrationInterface {
	name = ' $npmConfigName1725670092256';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE INDEX "idx-mfa-infos-status" ON "mfa_infos" ("status") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."idx-mfa-infos-status"`);
	}
}
