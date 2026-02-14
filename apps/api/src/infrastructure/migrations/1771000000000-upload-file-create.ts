import { MigrationInterface, QueryRunner } from 'typeorm';

export class UploadFileCreate1771000000000 implements MigrationInterface {
  name = 'UploadFileCreate1771000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "upload_file" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "url" character varying NOT NULL, "type" character varying NOT NULL, "room_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_upload_file_public_id" UNIQUE ("public_id"), CONSTRAINT "PK_upload_file_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "upload_file" ADD CONSTRAINT "FK_upload_file_room" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "upload_file" DROP CONSTRAINT "FK_upload_file_room"`,
    );
    await queryRunner.query(`DROP TABLE "upload_file"`);
  }
}
