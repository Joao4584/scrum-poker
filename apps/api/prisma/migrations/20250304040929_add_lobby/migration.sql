-- CreateTable
CREATE TABLE "lobbies" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "maxCapacity" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LobbyParticipant" (
    "id" SERIAL NOT NULL,
    "lobbyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LobbyParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lobbies_uuid_key" ON "lobbies"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "LobbyParticipant_lobbyId_userId_key" ON "LobbyParticipant"("lobbyId", "userId");

-- AddForeignKey
ALTER TABLE "LobbyParticipant" ADD CONSTRAINT "LobbyParticipant_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "lobbies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LobbyParticipant" ADD CONSTRAINT "LobbyParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
