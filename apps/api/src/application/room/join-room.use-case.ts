import {
  Inject,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';
import { RoomParticipantsRepository } from '@/infrastructure/repositories/room-participant.repository';
import { UlidService } from '@/shared/ulid/ulid.service';

@Injectable()
export class JoinRoomUseCase {
  constructor(
    @Inject(RoomsRepository) private readonly roomsRepository: RoomsRepository,
    @Inject(RoomParticipantsRepository)
    private readonly roomParticipantsRepository: RoomParticipantsRepository,
    @Inject(UlidService) private readonly ulidService: UlidService,
  ) {}

  async execute(room_public_id: string, user_id: number) {
    const room = await this.roomsRepository.findRoomByPublicId(room_public_id);
    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }

    const existingParticipant =
      await this.roomParticipantsRepository.findRoomParticipant(
        room.id,
        user_id,
      );
    if (existingParticipant) {
      throw new ConflictException('Você já está nesta sala');
    }

    const public_id = this.ulidService.generateId();
    return await this.roomParticipantsRepository.createRoomParticipant({
      room_id: room.id,
      user_id,
      public_id,
      joined_at: new Date(),
    });
  }
}
