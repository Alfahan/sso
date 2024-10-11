import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1728617711828 implements MigrationInterface {
	name = ' $npmConfigName1728617711828';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_a06c0ed2044fab18ba5b179c0c4" UNIQUE ("username_bidx")`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_599f180522f52ed9f2465a60eff" UNIQUE ("phone_bidx")`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "UQ_480f6ec5189667c2a3c8aa8eec1" UNIQUE ("email_bidx")`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "UQ_480f6ec5189667c2a3c8aa8eec1"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "UQ_599f180522f52ed9f2465a60eff"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" DROP CONSTRAINT "UQ_a06c0ed2044fab18ba5b179c0c4"`,
		);
	}
}
