import { MigrationInterface, QueryRunner } from "typeorm";

export class FriendsCreate1766371204500 implements MigrationInterface {
    name = 'FriendsCreate1766371204500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friends" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "user_id" integer NOT NULL, "friend_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_c30f94907194772ab24cc41983f" UNIQUE ("public_id"), CONSTRAINT "PK_65e1b06a9f379ee5255054021e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_f2534e418d51fa6e5e8cdd4b480" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friends" ADD CONSTRAINT "FK_c9d447f72456a67d17ec30c5d00" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_c9d447f72456a67d17ec30c5d00"`);
        await queryRunner.query(`ALTER TABLE "friends" DROP CONSTRAINT "FK_f2534e418d51fa6e5e8cdd4b480"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`DROP TABLE "friends"`);
    }

}
