import { Inject, Injectable } from '@nestjs/common';
import type { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';

@Injectable()
export class LoadUserIntegrationUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: IntegrationUserRequest) {
    return this.usersRepository.loadUserIntegration(data);
  }
}
