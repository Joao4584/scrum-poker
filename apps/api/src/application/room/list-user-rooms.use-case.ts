import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class ListUserRoomsUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
  ) {}
  async execute(
    user_id: number,
    options: {
      order?: 'ASC' | 'DESC';
      owner_only?: number | boolean | string;
    },
  ) {
    const owner_only =
      options.owner_only === 1 ||
      options.owner_only === true ||
      options.owner_only === '1' ||
      options.owner_only === 'true';
    return await this.roomsRepository.findRecentByUserId(user_id, {
      ...options,
      owner_only,
    });
  }
}
