import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1728430035577 implements MigrationInterface {
	name = ' $npmConfigName1728430035577';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX "public"."idx-users-phone_number"`);
		await queryRunner.query(
			`CREATE TABLE "internals" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nik" character varying, "position" character varying, "directorate" character varying, "division" character varying, "unit" character varying, "employee_status" character varying, "user_id" uuid, CONSTRAINT "REL_f1f86456bf1abc76a2c909cdf8" UNIQUE ("user_id"), CONSTRAINT "PK_be76afade515cd597f35d096818" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-nik" ON "internals" ("nik") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-internals-user_id" ON "internals" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "partners" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ecosystem_id" character varying, "ecosystem_name" character varying, "is_ecosystem_owner" boolean NOT NULL DEFAULT true, "user_id" uuid, CONSTRAINT "REL_6aee7fd33891dbfa5ccbbdfe08" UNIQUE ("user_id"), CONSTRAINT "PK_998645b20820e4ab99aeae03b41" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-partners-ecosystem_name" ON "partners" ("ecosystem_name") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-partners-ecosystem_id" ON "partners" ("ecosystem_id") `,
		);
		await queryRunner.query(
			`ALTER TABLE "users" DROP COLUMN "phone_number"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "username_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "phone" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "phone_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "email_bidx" character varying`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-phone_bidx" ON "users" ("phone_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-phone" ON "users" ("phone") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-email_bidx" ON "users" ("email_bidx") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-username_bidx" ON "users" ("username_bidx") `,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" ADD CONSTRAINT "FK_f1f86456bf1abc76a2c909cdf8c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "partners" ADD CONSTRAINT "FK_6aee7fd33891dbfa5ccbbdfe084" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "partners" DROP CONSTRAINT "FK_6aee7fd33891dbfa5ccbbdfe084"`,
		);
		await queryRunner.query(
			`ALTER TABLE "internals" DROP CONSTRAINT "FK_f1f86456bf1abc76a2c909cdf8c"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-users-username_bidx"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-users-email_bidx"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-phone"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-phone_bidx"`);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email_bidx"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_bidx"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
		await queryRunner.query(
			`ALTER TABLE "users" DROP COLUMN "username_bidx"`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "phone_number" character varying NOT NULL`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-partners-ecosystem_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-partners-ecosystem_name"`,
		);
		await queryRunner.query(`DROP TABLE "partners"`);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-user_id"`);
		await queryRunner.query(`DROP INDEX "public"."idx-internals-nik"`);
		await queryRunner.query(`DROP TABLE "internals"`);
		await queryRunner.query(
			`CREATE INDEX "idx-users-phone_number" ON "users" ("phone_number") `,
		);
	}
}
