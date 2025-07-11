import { LobbyRepository } from '@/infrastructure/repositories/lobby.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MarkLobbyAsEmptyUseCase {
  constructor(@Inject(LobbyRepository) private readonly lobbyRepository: LobbyRepository,) {}

  async execute(lobbyUuid: string) {
    // await this.lobbyRepository.updateMany({
    //   where: { lobby: { uuid: lobbyUuid }, deletedAt: null },
    //   data: { deletedAt: new Date() },
    // });
  }
}
