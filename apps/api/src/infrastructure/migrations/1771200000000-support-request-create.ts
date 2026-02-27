import { MigrationInterface, QueryRunner } from 'typeorm';

export class SupportRequestCreate1771200000000 implements MigrationInterface {
  name = 'SupportRequestCreate1771200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "support_request" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "user_id" integer NOT NULL, "subject" character varying(120) NOT NULL, "message" text NOT NULL, "rating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "CHK_support_request_rating_range" CHECK ("rating" BETWEEN 1 AND 5), CONSTRAINT "UQ_support_request_public_id" UNIQUE ("public_id"), CONSTRAINT "PK_support_request_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "support_request" ADD CONSTRAINT "FK_support_request_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "support_request" DROP CONSTRAINT "FK_support_request_user"`);
    await queryRunner.query(`DROP TABLE "support_request"`);
  }
}
