import { Inject, Injectable } from '@nestjs/common';
import type { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}
  async execute(data: IntegrationUserRequest) {
    return await this.usersRepository.insertUser(data);
  }
}
