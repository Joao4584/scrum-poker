import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPublicIdToEntities1752550077105 implements MigrationInterface {
  name = 'AddPublicIdToEntities1752550077105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_participant" RENAME COLUMN "uuid" TO "public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" RENAME CONSTRAINT "UQ_e1db258626cccd618e3e2c3e779" TO "UQ_231a9133b00d572a50cc9df9ef2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" RENAME COLUMN "uuid" TO "public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" RENAME CONSTRAINT "UQ_4ae2a03b4f70762789eaaed3803" TO "UQ_d00d83b66f5250ed5cb2f53cf56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" RENAME COLUMN "uuid" TO "public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" RENAME CONSTRAINT "UQ_6930ce56f7294538e3751b9f32a" TO "UQ_faf81e57a0dad048ec1f2183d5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "uuid" TO "public_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" TO "UQ_848b8b23bf0748243d4e1e76ae3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "UQ_4cc328315dd693133cad17e3d7c"`,
    );
    await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "uuid"`);
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
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "public_id" bigint NOT NULL`,
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
      `ALTER TABLE "users" ADD "public_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515"`,
    );
    await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "room" ADD "public_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "public_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56"`,
    );
    await queryRunner.query(`ALTER TABLE "vote" DROP COLUMN "public_id"`);
    await queryRunner.query(
      `ALTER TABLE "vote" ADD "public_id" character varying NOT NULL`,
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
      `ALTER TABLE "room_participant" ADD "public_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2" UNIQUE ("public_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD "uuid" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "UQ_4cc328315dd693133cad17e3d7c" UNIQUE ("uuid")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3" TO "UQ_951b8f1dfc94ac1d0301a14b7e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "public_id" TO "uuid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" RENAME CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f" TO "UQ_6930ce56f7294538e3751b9f32a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" RENAME COLUMN "public_id" TO "uuid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" RENAME CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56" TO "UQ_4ae2a03b4f70762789eaaed3803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" RENAME COLUMN "public_id" TO "uuid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" RENAME CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2" TO "UQ_e1db258626cccd618e3e2c3e779"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" RENAME COLUMN "public_id" TO "uuid"`,
    );
  }
}
