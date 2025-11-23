import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1762728102168 implements MigrationInterface {
  name = 'Init1762728102168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room_participant" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "room_id" integer NOT NULL, "user_id" integer NOT NULL, "is_admin" boolean NOT NULL DEFAULT false, "joined_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_231a9133b00d572a50cc9df9ef2" UNIQUE ("public_id"), CONSTRAINT "PK_f4e1d0fa763659c18b645646130" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vote" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "question_id" integer NOT NULL, "user_id" integer NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_d00d83b66f5250ed5cb2f53cf56" UNIQUE ("public_id"), CONSTRAINT "PK_2d5932d46afe39c8176f9d4be72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "room_id" integer NOT NULL, "text" character varying NOT NULL, "revealed" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_faf81e57a0dad048ec1f2183d5f" UNIQUE ("public_id"), CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "name" character varying NOT NULL, "description" character varying, "is_public" boolean NOT NULL DEFAULT true, "voting_scale" character varying, "status" character varying NOT NULL DEFAULT 'open', "password" character varying, "owner_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_4c8143f50f1c635847a50bd4515" UNIQUE ("public_id"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_language_enum" AS ENUM('en_us', 'pt_br')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "public_id" character varying(26) NOT NULL, "last_login_iat" bigint, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "github_id" character varying, "google_id" character varying, "avatar_url" character varying, "status" character varying NOT NULL DEFAULT 'available', "github_link" character varying, "bio" character varying, "language" "public"."users_language_enum" NOT NULL DEFAULT 'pt_br', "last_online" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_848b8b23bf0748243d4e1e76ae3" UNIQUE ("public_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_09a2296ade1053a0cc4080bda4a" UNIQUE ("github_id"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD CONSTRAINT "FK_e2fdb65131fd5bf286f19c0f333" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" ADD CONSTRAINT "FK_97ace299842b63901959fab1adc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_d377f94e59af78156cd1b451321" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" ADD CONSTRAINT "FK_af8728cf605f1988d2007d094f5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_d95a1ed954ef806357f3b299805" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "FK_6dfeeefd28618a1351a1a1a9171" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "FK_6dfeeefd28618a1351a1a1a9171"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_d95a1ed954ef806357f3b299805"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_af8728cf605f1988d2007d094f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vote" DROP CONSTRAINT "FK_d377f94e59af78156cd1b451321"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" DROP CONSTRAINT "FK_97ace299842b63901959fab1adc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_participant" DROP CONSTRAINT "FK_e2fdb65131fd5bf286f19c0f333"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_language_enum"`);
    await queryRunner.query(`DROP TABLE "room"`);
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(`DROP TABLE "vote"`);
    await queryRunner.query(`DROP TABLE "room_participant"`);
  }
}
