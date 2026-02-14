import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { VotingScale } from '@/shared/enums/voting-scale.enum';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    private readonly roomsRepository: RoomTypeOrmRepository,
    private readonly ulidService: UlidService,
  ) {}
  async execute(data: {
    name: string;
    description?: string;
    owner_id: number;
    is_public: boolean;
    voting_scale?: VotingScale;
  }) {
    const public_id = this.ulidService.generateId();
    return await this.roomsRepository.create({ ...data, public_id });
  }
}
