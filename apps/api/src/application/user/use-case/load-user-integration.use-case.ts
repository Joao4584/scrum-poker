import { Injectable } from '@nestjs/common';
import {
  IntegrationUser,
  UserTypeOrmRepository,
} from '@/infrastructure/repositories/user.repository';

@Injectable()
export class LoadUserIntegrationUseCase {
  constructor(
    private readonly usersRepository: UserTypeOrmRepository,
  ) {}

  async execute(data: IntegrationUser) {
    return this.usersRepository.findByIntegration(data);
  }
}
