import { Inject, Injectable } from '@nestjs/common';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';
import { UlidService } from '@/shared/ulid/ulid.service';
import { VotingScale } from '@api/shared/enums/voting-scale.enum';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(RoomsRepository) private readonly roomsRepository: RoomsRepository,
    @Inject(UlidService)
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
    return await this.roomsRepository.createRoom({ ...data, public_id });
  }
}
