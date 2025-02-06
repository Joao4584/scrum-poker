import { Inject, Injectable } from '@nestjs/common';
import type { IntegrationUserRequest } from '../requests/integration-user.request';
import { UsersRepository } from '../repositories/users.repo';

@Injectable()
export class LoadUserIntegrationUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async execute(data: IntegrationUserRequest) {
    return this.usersRepository.loadUserIntegration(data);
  }
}
