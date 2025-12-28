import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class GetRoomUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
  ) {}
  async execute(public_id: string) {
    return await this.roomsRepository.findByPublicId(public_id);
  }
}
