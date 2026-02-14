import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
  ) {}
  async execute(public_id: string) {
    await this.roomsRepository.deleteByPublicId(public_id);
  }
}
