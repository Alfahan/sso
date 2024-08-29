import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1724921371423 implements MigrationInterface {
	name = ' $npmConfigName1724921371423';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "login_logs" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "ip" character varying NOT NULL, "os" character varying NOT NULL, "browser" character varying NOT NULL, "country" character varying NOT NULL, "action" character varying NOT NULL, "userIdId" uuid, CONSTRAINT "PK_15f7b02ad55d5ba905b2962ebab" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-deleted_at" ON "login_logs" ("deleted_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-updated_at" ON "login_logs" ("updated_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-created_at" ON "login_logs" ("created_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-action" ON "login_logs" ("action") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-login-logs-user_id" ON "login_logs" ("user_id") `,
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
			`CREATE INDEX "idx-users-no_phone" ON "users" ("no_phone") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-email" ON "users" ("email") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_tokens" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" character varying NOT NULL, "status" character varying NOT NULL, "userIdId" uuid, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`,
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
			`ALTER TABLE "login_logs" ADD CONSTRAINT "FK_e31237afecf10cd3f86a658111b" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_37eb0e7bb7b9e775fb054b50602" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_37eb0e7bb7b9e775fb054b50602"`,
		);
		await queryRunner.query(
			`ALTER TABLE "login_logs" DROP CONSTRAINT "FK_e31237afecf10cd3f86a658111b"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-created_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-updated_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-deleted_at"`);
		await queryRunner.query(`DROP TABLE "todos"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-tokens-user_id"`,
		);
		await queryRunner.query(`DROP TABLE "user_tokens"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-email"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-no_phone"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-created_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-updated_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-deleted_at"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP INDEX "public"."idx-login-logs-user_id"`);
		await queryRunner.query(`DROP INDEX "public"."idx-login-logs-action"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-login-logs-created_at"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-login-logs-updated_at"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-login-logs-deleted_at"`,
		);
		await queryRunner.query(`DROP TABLE "login_logs"`);
	}
}
