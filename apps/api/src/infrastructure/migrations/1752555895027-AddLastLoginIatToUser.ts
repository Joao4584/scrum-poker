import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLastLoginIatToUser1752555895027 implements MigrationInterface {
  name = 'AddLastLoginIatToUser1752555895027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "last_login_iat" bigint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_login_iat"`);
  }
}
