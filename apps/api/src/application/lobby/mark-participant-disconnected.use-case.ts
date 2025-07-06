import { Inject, Injectable } from '@nestjs/common';
import { LobbyRepository } from '@/infrastructure/repositories/lobby.repository';

@Injectable()
export class MarkParticipantAsDisconnectedUseCase {
  constructor(
    @Inject(LobbyRepository) private readonly lobbyRepository: LobbyRepository,
  ) {}
  async execute(userId: number, lobbyUuid: string) {
    const lobby = await this.lobbyRepository.findByUuid(lobbyUuid);
    if (!lobby) return;

    await this.lobbyRepository.markParticipantAsDeleted(userId, lobby.id);
  }
}
