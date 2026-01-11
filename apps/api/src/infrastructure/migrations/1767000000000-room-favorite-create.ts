import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoomFavoriteCreate1767000000000 implements MigrationInterface {
  name = 'RoomFavoriteCreate1767000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room_favorite" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "user_id" integer NOT NULL, "room_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_room_favorite_public_id" UNIQUE ("public_id"), CONSTRAINT "UQ_room_favorite_user_room" UNIQUE ("user_id","room_id"), CONSTRAINT "PK_room_favorite_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_favorite" ADD CONSTRAINT "FK_room_favorite_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_favorite" ADD CONSTRAINT "FK_room_favorite_room" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_favorite" DROP CONSTRAINT "FK_room_favorite_room"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_favorite" DROP CONSTRAINT "FK_room_favorite_user"`,
    );
    await queryRunner.query(`DROP TABLE "room_favorite"`);
  }
}
