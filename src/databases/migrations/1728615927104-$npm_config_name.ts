import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1728615927104 implements MigrationInterface {
	name = ' $npmConfigName1728615927104';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "nik_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "position_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "directorate_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "division_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "unit_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD "ktp_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD "npwp_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD "address_bidx" character varying`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-nik"`);
		await queryRunner.query(`ALTER TABLE "internals" DROP COLUMN "nik"`);
		await queryRunner.query(`ALTER TABLE "internals" ADD "nik" bytea`);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "position"`,
		);
		await queryRunner.query(`ALTER TABLE "internals" ADD "position" bytea`);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "directorate"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "directorate" bytea`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "division"`,
		);
		await queryRunner.query(`ALTER TABLE "internals" ADD "division" bytea`);
		await queryRunner.query(`ALTER TABLE "internals" DROP COLUMN "unit"`);
		await queryRunner.query(`ALTER TABLE "internals" ADD "unit" bytea`);
		await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "ktp"`);
		await queryRunner.query(`ALTER TABLE "customers" ADD "ktp" bytea`);
		await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "npwp"`);
		await queryRunner.query(`ALTER TABLE "customers" ADD "npwp" bytea`);
		await queryRunner.query(
			`ALTER TABLE "customers" DROP COLUMN "address"`,
		);
		await queryRunner.query(`ALTER TABLE "customers" ADD "address" bytea`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-username"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "username" bytea`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-phone"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "phone" bytea`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-email"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "email" bytea`);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-deleted_at" ON "internals" ("deleted_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-updated_at" ON "internals" ("updated_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-created_at" ON "internals" ("created_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-unit_bidx" ON "internals" ("unit_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-unit" ON "internals" ("unit") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-division_bidx" ON "internals" ("division_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-division" ON "internals" ("division") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-directorate_bidx" ON "internals" ("directorate_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-directorate" ON "internals" ("directorate") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-position_bidx" ON "internals" ("position_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-position" ON "internals" ("position") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-nik_bidx" ON "internals" ("nik_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-nik" ON "internals" ("nik") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-deleted_at" ON "customers" ("deleted_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-updated_at" ON "customers" ("updated_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-created_at" ON "customers" ("created_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-address_bidx" ON "customers" ("address_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-address" ON "customers" ("address") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-npwp_bidx" ON "customers" ("npwp_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-npwp" ON "customers" ("npwp") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-ktp_bidx" ON "customers" ("ktp_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-ktp" ON "customers" ("ktp") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-phone" ON "users" ("phone") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-email" ON "users" ("email") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-username" ON "users" ("username") `,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."idx-users-username"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-email"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-phone"`);
		await queryRunner.query(`DROP INDEX "public"."idx-customers-ktp"`);
		await queryRunner.query(`DROP INDEX "public"."idx-customers-ktp_bidx"`);
		await queryRunner.query(`DROP INDEX "public"."idx-customers-npwp"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-customers-npwp_bidx"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-customers-address"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-customers-address_bidx"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-customers-created_at"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-customers-updated_at"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-customers-deleted_at"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-nik"`);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-nik_bidx"`);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-position"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-position_bidx"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-directorate"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-directorate_bidx"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-division"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-division_bidx"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-unit"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-unit_bidx"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-created_at"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-updated_at"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-internals-deleted_at"`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "email" character varying`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-email" ON "users" ("email") `,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "phone" character varying`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-phone" ON "users" ("phone") `,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "username" character varying`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-username" ON "users" ("username") `,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" DROP COLUMN "address"`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD "address" character varying`,
		);
		await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "npwp"`);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD "npwp" character varying`,
		);
		await queryRunner.query(`ALTER TABLE "customers" DROP COLUMN "ktp"`);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD "ktp" character varying`,
		);
		await queryRunner.query(`ALTER TABLE "internals" DROP COLUMN "unit"`);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "unit" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "division"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "division" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "directorate"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "directorate" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "position"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "position" character varying`,
		);
		await queryRunner.query(`ALTER TABLE "internals" DROP COLUMN "nik"`);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD "nik" character varying`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-nik" ON "internals" ("nik") `,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" DROP COLUMN "address_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" DROP COLUMN "npwp_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" DROP COLUMN "ktp_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "unit_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "division_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "directorate_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "position_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP COLUMN "nik_bidx"`,
		);
	}
}
