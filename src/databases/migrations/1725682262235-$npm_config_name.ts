import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1725682262235 implements MigrationInterface {
	name = ' $npmConfigName1725682262235';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD "ip_origin" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD "geolocation" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD "country" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD "browser" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD "os_type" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD "device" character varying`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-device" ON "user_reset_passwords" ("device") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-os_type" ON "user_reset_passwords" ("os_type") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-browser" ON "user_reset_passwords" ("browser") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-country" ON "user_reset_passwords" ("country") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-geolocation" ON "user_reset_passwords" ("geolocation") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-ip_origin" ON "user_reset_passwords" ("ip_origin") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-ip_origin"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-geolocation"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-country"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-browser"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-os_type"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-device"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP COLUMN "device"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP COLUMN "os_type"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP COLUMN "browser"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP COLUMN "country"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP COLUMN "geolocation"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP COLUMN "ip_origin"`,
		);
	}
}
