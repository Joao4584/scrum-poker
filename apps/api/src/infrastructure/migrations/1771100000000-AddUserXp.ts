import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserXp1771100000000 implements MigrationInterface {
  name = 'AddUserXp1771100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "xp" integer NOT NULL DEFAULT 0`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "xp"`);
  }
}
