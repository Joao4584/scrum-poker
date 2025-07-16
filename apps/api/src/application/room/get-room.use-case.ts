import { Inject, Injectable } from '@nestjs/common';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class GetRoomUseCase {
  constructor(
    @Inject(RoomsRepository) private readonly roomsRepository: RoomsRepository,
  ) {}
  async execute(public_id: string) {
    return await this.roomsRepository.findRoomByPublicId(public_id);
  }
}
