import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomParticipant } from '../entities/room-participant.entity';
export interface CreateRoomParticipantInput {
  public_id: string;
  room_id: number;
  user_id: number;
  joined_at: Date;
  is_admin?: boolean;
}

@Injectable()
export class RoomParticipantTypeOrmRepository {
  constructor(
    @InjectRepository(RoomParticipant)
    private readonly roomParticipantRepository: Repository<RoomParticipant>,
  ) {}

  async create(data: CreateRoomParticipantInput): Promise<RoomParticipant> {
    const newRoomParticipant = this.roomParticipantRepository.create({
      ...data,
      is_admin: data.is_admin ?? false,
    });
    const saved = await this.roomParticipantRepository.save(newRoomParticipant);
    return saved;
  }

  async findByRoomAndUser(
    room_id: number,
    user_id: number,
  ): Promise<RoomParticipant | null> {
    const participant = await this.roomParticipantRepository.findOne({
      where: { room_id, user_id, deleted_at: null },
    });
    return participant;
  }
}
