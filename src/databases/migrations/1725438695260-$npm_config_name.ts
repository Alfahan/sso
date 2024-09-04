import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1725438695260 implements MigrationInterface {
	name = ' $npmConfigName1725438695260';

	public async up(queryRunner: QueryRunner): Promise<void> {
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
			`CREATE TABLE "auth_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ip_origin" character varying, "geolocation" character varying, "country" character varying, "browser" character varying, "os_type" character varying, "device" character varying, "action_type" character varying NOT NULL, "action_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_ef1314fa983d71bb54a74ca6d40" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-auth-histories-action_type" ON "auth_histories" ("action_type") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-auth-histories-user_id" ON "auth_histories" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_reset_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_65b9e47530f1e075a92d1f900ca" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-status" ON "user_reset_passwords" ("status") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-reset-passwords-user_id" ON "user_reset_passwords" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "user_audit_trails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entity_name" character varying, "before_value" text, "after_value" text, "entry_at" TIMESTAMP NOT NULL DEFAULT now(), "entry_by" character varying, "user_id" uuid, CONSTRAINT "PK_d33e68a830e8a94f33dbe36e0f9" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-audit-trails-entry_at" ON "user_audit_trails" ("entry_at") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-user-audit-trails-user_id" ON "user_audit_trails" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "mfa_infos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp_code" character varying, "otp_expired_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_7f23dfc401a8c39c06dbdc320fd" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-mfa-infos-otp_code" ON "mfa_infos" ("otp_code") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-mfa-infos-user_id" ON "mfa_infos" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" character varying, "segment" character varying, "failed_login_attempts" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
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
			`CREATE INDEX "idx-users-phone_number" ON "users" ("phone_number") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-email" ON "users" ("email") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-users-username" ON "users" ("username") `,
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
			`CREATE TABLE "customers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT '1', "created_name" character varying NOT NULL DEFAULT 'System', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "updated_name" character varying, "deleted_at" TIMESTAMP, "deleted_by" character varying, "deleted_name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ktp" character varying, "npwp" character varying, "service_model" character varying, "type" character varying, "wapu_type" character varying, "address" character varying, "user_id" uuid, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-customers-user_id" ON "customers" ("user_id") `,
		);
		await queryRunner.query(
			`CREATE TABLE "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "third_party_name" character varying NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-api-keys-status" ON "api_keys" ("status") `,
		);
		await queryRunner.query(
			`CREATE INDEX "idx-api-keys-third_party_name" ON "api_keys" ("third_party_name") `,
		);
		await queryRunner.query(
			`ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "auth_histories" ADD CONSTRAINT "FK_bad980508eb870587b0a1cf13f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" ADD CONSTRAINT "FK_3c7be6a22906fc6aa7355309de0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_audit_trails" ADD CONSTRAINT "FK_a4f42eb8e870a32f46f7ca2e49e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "mfa_infos" ADD CONSTRAINT "FK_1f3a3904b0b4f53ac44ac8fb2f2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`,
		);
		await queryRunner.query(
			`ALTER TABLE "mfa_infos" DROP CONSTRAINT "FK_1f3a3904b0b4f53ac44ac8fb2f2"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_audit_trails" DROP CONSTRAINT "FK_a4f42eb8e870a32f46f7ca2e49e"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_reset_passwords" DROP CONSTRAINT "FK_3c7be6a22906fc6aa7355309de0"`,
		);
		await queryRunner.query(
			`ALTER TABLE "auth_histories" DROP CONSTRAINT "FK_bad980508eb870587b0a1cf13f7"`,
		);
		await queryRunner.query(
			`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_9e144a67be49e5bba91195ef5de"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-api-keys-third_party_name"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-api-keys-status"`);
		await queryRunner.query(`DROP TABLE "api_keys"`);
		await queryRunner.query(`DROP INDEX "public"."idx-customers-user_id"`);
		await queryRunner.query(`DROP TABLE "customers"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-created_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-updated_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-todos-deleted_at"`);
		await queryRunner.query(`DROP TABLE "todos"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-username"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-email"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-phone_number"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-status"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-created_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-updated_at"`);
		await queryRunner.query(`DROP INDEX "public"."idx-users-deleted_at"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP INDEX "public"."idx-mfa-infos-user_id"`);
		await queryRunner.query(`DROP INDEX "public"."idx-mfa-infos-otp_code"`);
		await queryRunner.query(`DROP TABLE "mfa_infos"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-audit-trails-user_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-audit-trails-entry_at"`,
		);
		await queryRunner.query(`DROP TABLE "user_audit_trails"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-user_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-reset-passwords-status"`,
		);
		await queryRunner.query(`DROP TABLE "user_reset_passwords"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-auth-histories-user_id"`,
		);
		await queryRunner.query(
			`DROP INDEX "public"."idx-auth-histories-action_type"`,
		);
		await queryRunner.query(`DROP TABLE "auth_histories"`);
		await queryRunner.query(
			`DROP INDEX "public"."idx-user-tokens-user_id"`,
		);
		await queryRunner.query(`DROP INDEX "public"."idx-user-tokens-status"`);
		await queryRunner.query(`DROP TABLE "user_tokens"`);
	}
}
