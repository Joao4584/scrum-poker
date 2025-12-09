import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomParticipant } from '../entities/room-participant.entity';
import {
  CreateRoomParticipantInput,
  RoomParticipantRepository,
} from '@/domain/room/repositories/room-participant.repository';

@Injectable()
export class RoomParticipantTypeOrmRepository
  implements RoomParticipantRepository
{
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
