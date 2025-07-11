import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { LobbyRepository } from '../../infrastructure/repositories/lobby.repository';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';

@Injectable()
export class AddParticipantLobbyUseCase {
  constructor(
    @Inject(LobbyRepository) private readonly lobbyRepository: LobbyRepository,
    @Inject(UsersRepository) private readonly userRepository: UsersRepository,
  ) {}
  async execute(user_id: number, lobbyUuid: string) {
    const userExists = await this.userRepository.userExists(user_id)
  

    const lobby = await this.lobbyRepository.findByUuid(lobbyUuid);
    if (!lobby) throw new BadRequestException('Lobby not found.');

    await this.lobbyRepository.addParticipant(user_id, lobby.id);
  }
}