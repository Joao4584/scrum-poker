import { Inject, Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import {
  ROOM_REPOSITORY,
  RoomRepository,
} from '@/domain/room/repositories/room.repository';
import {
  ROOM_PARTICIPANT_REPOSITORY,
  RoomParticipantRepository,
} from '@/domain/room/repositories/room-participant.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomsRepository: RoomRepository,
    @Inject(ROOM_PARTICIPANT_REPOSITORY)
    private readonly roomParticipantsRepository: RoomParticipantRepository,
    @Inject(UlidService) private readonly ulidService: UlidService,
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
