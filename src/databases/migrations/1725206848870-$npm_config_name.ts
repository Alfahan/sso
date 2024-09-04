import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1725206848870 implements MigrationInterface {
	name = ' $npmConfigName1725206848870';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip" character varying, "os" character varying, "browser" character varying, "country" character varying, "device" character varying, "action" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-action" ON "activity_logs" ("action") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-user_id" ON "activity_logs" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_reset_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_65b9e47530f1e075a92d1f900ca" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-token-status" ON "user_reset_passwords" ("status") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-token-user_id" ON "user_reset_passwords" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "no_phone" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-deleted_at" ON "users" ("deleted_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-updated_at" ON "users" ("updated_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-created_at" ON "users" ("created_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-status" ON "users" ("status") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-no_phone" ON "users" ("no_phone") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-email" ON "users" ("email") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-tokens-status" ON "user_tokens" ("status") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-tokens-user_id" ON "user_tokens" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "todos" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-todos-deleted_at" ON "todos" ("deleted_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-todos-updated_at" ON "todos" ("updated_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-todos-created_at" ON "todos" ("created_at") `,
		);
		await queryRunner.query(
			`CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "third_party_name" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_d54f841fa5478e4734590d44036" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD CONSTRAINT "FK_3c7be6a22906fc6aa7355309de0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_9e144a67be49e5bba91195ef5de"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP CONSTRAINT "FK_3c7be6a22906fc6aa7355309de0"`,
		);
		await queryRunner.query(
			`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_d54f841fa5478e4734590d44036"`,
		);
		await queryRunner.query(`DROP TABLE "api_keys"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-created_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-updated_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-deleted_at"`);
		await queryRunner.query(`DROP TABLE "todos"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-tokens-user_id"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-user-tokens-status"`);
		await queryRunner.query(`DROP TABLE "user_tokens"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-email"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-no_phone"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-status"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-created_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-updated_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-deleted_at"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP INDEX "public"."idx-user-token-user_id"`);
		await queryRunner.query(`DROP INDEX "public"."idx-user-token-status"`);
		await queryRunner.query(`DROP TABLE "user_reset_passwords"`);
		await queryRunner.query(`DROP INDEX "public"."idx-login-logs-user_id"`);
		await queryRunner.query(`DROP INDEX "public"."idx-login-logs-action"`);
		await queryRunner.query(`DROP TABLE "activity_logs"`);
	}
}
