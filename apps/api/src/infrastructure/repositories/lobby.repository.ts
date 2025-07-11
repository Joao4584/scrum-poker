import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lobby } from '../entities/lobby.entity';
import { LobbyParticipant } from '../entities/lobby-participant.entity';

@Injectable()
export class LobbyRepository {
  constructor(
    @InjectRepository(Lobby)
    private readonly lobbyRepository: Repository<Lobby>,
    @InjectRepository(LobbyParticipant)
    private readonly lobby_participant_repository: Repository<LobbyParticipant>,
  ) {}

  async findAvailableLobby(): Promise<Lobby | undefined> {
    return this.lobbyRepository.findOne({
      where: { deleted_at: null },
      relations: ['participants'],
    });
  }

  async createLobby(): Promise<Lobby> {
    const newLobby = this.lobbyRepository.create({});
    return this.lobbyRepository.save(newLobby);
  }

  async findByUuid(uuid: string): Promise<Lobby | undefined> {
    return this.lobbyRepository.findOne({ where: { uuid } });
  }

  async addParticipant(user_id: number, lobby_id: number): Promise<LobbyParticipant> {
    const existingParticipant = await this.lobby_participant_repository.findOne({
      where: { user_id, lobby_id },
    });

    if (existingParticipant) {
      existingParticipant.deleted_at = null;
      existingParticipant.joined_at = new Date();
      return this.lobby_participant_repository.save(existingParticipant);
    } else {
      const newParticipant = this.lobby_participant_repository.create({ user_id, lobby_id });
      return this.lobby_participant_repository.save(newParticipant);
    }
  }

  async markParticipantAsDeleted(user_id: number, lobby_id: number): Promise<void> {
    await this.lobby_participant_repository.update(
      { user_id, lobby_id },
      { deleted_at: new Date() },
    );
  }
}
