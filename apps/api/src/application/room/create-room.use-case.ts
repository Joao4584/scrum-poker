import { Inject, Injectable } from '@nestjs/common';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';
import { UlidService } from '@/shared/ulid/ulid.service';

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
  }) {
    const public_id = this.ulidService.generateId();
    return await this.roomsRepository.createRoom({ ...data, public_id });
  }
}
