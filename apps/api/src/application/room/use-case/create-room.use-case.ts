import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UlidService } from '@/shared/ulid/ulid.service';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { VotingScale } from '@/shared/enums/voting-scale.enum';
import { AppErrors } from '@/presentation/errors';

const ROOM_PASSWORD_SALT_ROUNDS = 12;

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
    password?: string;
    voting_scale?: VotingScale;
  }) {
    const public_id = this.ulidService.generateId();
    const password = data.password;

    if (data.is_public === false && (!password || password.trim().length === 0)) {
      throw AppErrors.badRequest('Private rooms must include a password');
    }

    const hashedPassword = data.is_public ? null : await bcrypt.hash(password!, ROOM_PASSWORD_SALT_ROUNDS);

    return await this.roomsRepository.create({
      ...data,
      public_id,
      password: hashedPassword,
    });
  }
}
