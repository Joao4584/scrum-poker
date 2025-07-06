import { Inject, Injectable } from '@nestjs/common';
import { LobbyRepository } from '@/infrastructure/repositories/lobby.repository';

@Injectable()
export class FindOrCreateLobbyUseCase {
  constructor(
    @Inject(LobbyRepository) private readonly lobbyRepository: LobbyRepository,
  ) {}
  async execute(userId: number) {
    let lobby = await this.lobbyRepository.findAvailableLobby();

    if (!lobby || lobby.participants.length > lobby.maxCapacity) {
      lobby = (await this.lobbyRepository.createLobby()) as any;
    }
    return { uuid: lobby.uuid };
  }
}
