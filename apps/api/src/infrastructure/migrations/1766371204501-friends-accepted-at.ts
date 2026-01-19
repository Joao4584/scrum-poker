import { MigrationInterface, QueryRunner } from 'typeorm';

export class FriendsAcceptedAt1766371204501 implements MigrationInterface {
  name = 'FriendsAcceptedAt1766371204501';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friends" ADD "accepted_at" TIMESTAMP`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "friends" DROP COLUMN "accepted_at"`);
  }
}
