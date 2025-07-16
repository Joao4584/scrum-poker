import { Inject, Injectable } from '@nestjs/common';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class DeleteRoomUseCase {
  constructor(
    @Inject(RoomsRepository) private readonly roomsRepository: RoomsRepository,
  ) {}
  async execute(public_id: string) {
    await this.roomsRepository.deleteRoom(public_id);
  }
}
