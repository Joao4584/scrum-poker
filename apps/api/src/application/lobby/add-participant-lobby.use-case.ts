import { Inject, Injectable } from '@nestjs/common';
import { LobbyRepository } from '@/infrastructure/repositories/lobby.repository';

@Injectable()
export class AddParticipantLobbyUseCase {
  constructor(
    @Inject(LobbyRepository) private readonly lobbyRepository: LobbyRepository,
  ) {}
  async execute(userId: number, lobbyUuid: string) {
    const lobby = await this.lobbyRepository.findByUuid(lobbyUuid);
    if (!lobby) throw new Error('Lobby não encontrado');

    await this.lobbyRepository.addParticipant(userId, lobby.id);
  }
}
