import { Inject, Injectable } from '@nestjs/common';
import { IntegrationUser } from '@/domain/user/integration-user';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@/domain/user/user.repository';

@Injectable()
export class LoadUserIntegrationUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository: UserRepository,
  ) {}

  async execute(data: IntegrationUser) {
    return this.usersRepository.findByIntegration(data);
  }
}
