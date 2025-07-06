import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

@Injectable()
export class MarkLobbyAsEmptyUseCase {
  constructor(@Inject('PrismaConnect') private readonly prisma: PrismaClient) {}

  async execute(lobbyUuid: string) {
    await this.prisma.lobbyParticipant.updateMany({
      where: { lobby: { uuid: lobbyUuid }, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
