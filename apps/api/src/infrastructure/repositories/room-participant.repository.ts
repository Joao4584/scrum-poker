import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomParticipant } from '../entities/room-participant.entity';

@Injectable()
export class RoomParticipantsRepository {
  constructor(
    @InjectRepository(RoomParticipant)
    private readonly roomParticipantRepository: Repository<RoomParticipant>,
  ) {}

  async createRoomParticipant(
    data: Partial<RoomParticipant>,
  ): Promise<RoomParticipant> {
    const newRoomParticipant = this.roomParticipantRepository.create(data);
    return this.roomParticipantRepository.save(newRoomParticipant);
  }

  async findRoomParticipant(
    room_id: number,
    user_id: number,
  ): Promise<RoomParticipant | undefined> {
    return this.roomParticipantRepository.findOne({
      where: { room_id, user_id, deleted_at: null },
    });
  }
}
