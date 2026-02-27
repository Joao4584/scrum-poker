import { MigrationInterface, QueryRunner } from 'typeorm';

export class SupportRequestAddRating1771200000001 implements MigrationInterface {
  name = 'SupportRequestAddRating1771200000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'support_request'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'support_request'
            AND column_name = 'rating'
        ) THEN
          ALTER TABLE "support_request" ADD COLUMN "rating" integer NOT NULL DEFAULT 3;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'support_request'
        ) AND NOT EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE table_name = 'support_request'
            AND constraint_name = 'CHK_support_request_rating_range'
        ) THEN
          ALTER TABLE "support_request"
            ADD CONSTRAINT "CHK_support_request_rating_range" CHECK ("rating" BETWEEN 1 AND 5);
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.table_constraints
          WHERE table_name = 'support_request'
            AND constraint_name = 'CHK_support_request_rating_range'
        ) THEN
          ALTER TABLE "support_request" DROP CONSTRAINT "CHK_support_request_rating_range";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'support_request'
            AND column_name = 'rating'
        ) THEN
          ALTER TABLE "support_request" DROP COLUMN "rating";
        END IF;
      END
      $$;
    `);
  }
}
