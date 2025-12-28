import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { RoomParticipantTypeOrmRepository } from '@/infrastructure/repositories/room-participant.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
    private readonly roomParticipantsRepository: RoomParticipantTypeOrmRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(room_public_id: string, user_id: number) {
    const room = await this.roomsRepository.findByPublicId(room_public_id);
    if (!room) {
      throw AppErrors.notFound('Sala não encontrada');
    }

    const existingParticipant =
      await this.roomParticipantsRepository.findByRoomAndUser(room.id, user_id);
    if (existingParticipant) {
      throw AppErrors.conflict('Você já está nesta sala');
    }

    const public_id = this.ulidService.generateId();
    return await this.roomParticipantsRepository.create({
      room_id: room.id,
      user_id,
      public_id,
      joined_at: new Date(),
    });
  }
}
