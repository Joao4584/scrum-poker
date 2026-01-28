import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCharacterKey1769565842476 implements MigrationInterface {
    name = 'AddCharacterKey1769565842476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_favorite" DROP CONSTRAINT "FK_room_favorite_user"`);
        await queryRunner.query(`ALTER TABLE "room_favorite" DROP CONSTRAINT "FK_room_favorite_room"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "character_key" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "room_favorite" ADD CONSTRAINT "FK_b1894b1ad916f4eb1a19d5b019b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_favorite" ADD CONSTRAINT "FK_e7b4e0bc5e614b8a593f3e0a9a6" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_favorite" DROP CONSTRAINT "FK_e7b4e0bc5e614b8a593f3e0a9a6"`);
        await queryRunner.query(`ALTER TABLE "room_favorite" DROP CONSTRAINT "FK_b1894b1ad916f4eb1a19d5b019b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "character_key"`);
        await queryRunner.query(`ALTER TABLE "room_favorite" ADD CONSTRAINT "FK_room_favorite_room" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_favorite" ADD CONSTRAINT "FK_room_favorite_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
