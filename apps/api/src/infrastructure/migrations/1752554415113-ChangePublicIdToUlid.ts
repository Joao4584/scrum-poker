import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePublicIdToUlid1752554415113 implements MigrationInterface {
  name = 'ChangePublicIdToUlid1752554415113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_participant" DROP CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" DROP COLUMN "public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD "public_id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56"`,
    );
    await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "vote" ADD "public_id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "public_id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515"`,
    );
    await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "room" ADD "public_id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "public_id" character varying(26) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3" UNIQUE ("public_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "public_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515"`,
    );
    await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "room" ADD "public_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "public_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56"`,
    );
    await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "vote" ADD "public_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" DROP CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" DROP COLUMN "public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD "public_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2" UNIQUE ("public_id")`,
    );
  }
}
