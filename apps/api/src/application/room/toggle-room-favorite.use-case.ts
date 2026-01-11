import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { RoomFavoriteTypeOrmRepository } from '@/infrastructure/repositories/room-favorite.repository';
import { User } from '@/infrastructure/entities/user.entity';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class ToggleRoomFavoriteUseCase {
  constructor(
    private readonly roomRepository: RoomTypeOrmRepository,
    private readonly favoriteRepository: RoomFavoriteTypeOrmRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(roomPublicId: string, user: User) {
    const room = await this.roomRepository.findByPublicId(roomPublicId);
    if (!room) {
      throw AppErrors.notFound('Sala não encontrada');
    }

    const existing = await this.favoriteRepository.findByUserAndRoom(
      user.id,
      room.id,
    );

    if (existing) {
      await this.favoriteRepository.delete(existing.id);
      return { liked: false };
    }

    const favorite = await this.favoriteRepository.create({
      public_id: this.ulidService.generateId(),
      user_id: user.id,
      room_id: room.id,
    });

    return { liked: true, favorite_public_id: favorite.public_id };
  }
}
