import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

@Injectable()
export class LobbyRepository {
  constructor(@Inject('PrismaConnect') private readonly prisma: PrismaClient) {}

  async findAvailableLobby() {
    return this.prisma.lobby.findFirst({
      where: { deletedAt: null },
      include: {
        participants: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async createLobby() {
    return this.prisma.lobby.create({ data: {} });
  }

  async findByUuid(uuid: string) {
    return this.prisma.lobby.findUnique({ where: { uuid } });
  }

  async addParticipant(userId: number, lobbyId: number) {
    return this.prisma.lobbyParticipant.upsert({
      where: { lobbyId_userId: { userId, lobbyId } },
      update: { deletedAt: null, joinedAt: new Date() },
      create: { userId, lobbyId },
    });
  }

  async markParticipantAsDeleted(userId: number, lobbyId: number) {
    return this.prisma.lobbyParticipant.updateMany({
      where: { userId, lobbyId },
      data: { deletedAt: new Date() },
    });
  }
}
