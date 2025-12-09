import { Inject, Injectable } from '@nestjs/common';
import {
  ROOM_REPOSITORY,
  RoomRepository,
} from '@/domain/room/repositories/room.repository';

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomsRepository: RoomRepository,
  ) {}
  async execute(public_id: string) {
    await this.roomsRepository.deleteByPublicId(public_id);
  }
}
