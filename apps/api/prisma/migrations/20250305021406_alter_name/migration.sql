/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Lobby` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lobby" DROP COLUMN "deleted_at",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
