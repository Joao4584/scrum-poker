import { Inject, Injectable } from '@nestjs/common';
import {
  ROOM_REPOSITORY,
  RoomRepository,
} from '@/domain/room/repositories/room.repository';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomsRepository: RoomRepository,
  ) {}
  async execute(public_id: string) {
    return await this.roomsRepository.findByPublicId(public_id);
  }
}
