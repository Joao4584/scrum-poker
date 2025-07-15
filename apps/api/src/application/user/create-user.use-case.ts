import { Inject, Injectable } from '@nestjs/common';
import type { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';
import { UlidService } from '@/shared/ulid/ulid.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @Inject(UlidService)
    private readonly ulidService: UlidService,
  ) {}
  async execute(data: IntegrationUserRequest) {
    const public_id = this.ulidService.generateId();
    return await this.usersRepository.insertUser({ ...data, public_id });
  }
}
