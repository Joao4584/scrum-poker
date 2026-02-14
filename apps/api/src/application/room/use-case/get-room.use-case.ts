import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class GetRoomUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
  ) {}
  async execute(public_id: string) {
    const room = await this.roomsRepository.findByPublicId(public_id);
    if (!room) {
      return null;
    }
    const { id, owner_id, password, owner, ...roomResponse } = room;
    return roomResponse;
  }
}
