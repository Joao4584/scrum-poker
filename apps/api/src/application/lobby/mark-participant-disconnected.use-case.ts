import { Inject, Injectable } from '@nestjs/common';
import { LobbyRepository } from '@/infrastructure/repositories/lobby.repository';

@Injectable()
export class MarkParticipantAsDisconnectedUseCase {
  constructor(
    @Inject(LobbyRepository) private readonly lobbyRepository: LobbyRepository,
  ) {}
  async execute(user_id: number, lobbyUuid: string) {
    const lobby = await this.lobbyRepository.findByUuid(lobbyUuid);
    if (!lobby) return;

    await this.lobbyRepository.markParticipantAsDeleted(user_id, lobby.id);
  }
}