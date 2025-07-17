import { Inject, Injectable } from '@nestjs/common';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class ListUserRoomsUseCase {
  constructor(
    @Inject(RoomsRepository) private readonly roomsRepository: RoomsRepository,
  ) {}
  async execute(
    user_id: number,
    options: { order?: 'ASC' | 'DESC'; owner_only?: number },
  ) {
    const owner_only = options.owner_only === 1;
    return await this.roomsRepository.findRecentRoomsByUserId(user_id, {
      ...options,
      owner_only,
    });
  }
}
