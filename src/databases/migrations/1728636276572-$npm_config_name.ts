import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1728636276572 implements MigrationInterface {
    name = ' $npmConfigName1728636276572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "failed_login_attempts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "failed_login_attempts" integer`);
    }

}
