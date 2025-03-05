/*
  Warnings:

  - You are about to drop the `lobbies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LobbyParticipant" DROP CONSTRAINT "LobbyParticipant_lobbyId_fkey";

-- DropTable
DROP TABLE "lobbies";

-- CreateTable
CREATE TABLE "Lobby" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lobby_uuid_key" ON "Lobby"("uuid");

-- AddForeignKey
ALTER TABLE "LobbyParticipant" ADD CONSTRAINT "LobbyParticipant_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
