import { Injectable } from '@nestjs/common';
import { IntegrationUser, UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

  async execute(data: IntegrationUser) {
    return await this.usersRepository.create({
      email: data.email,
      name: data.name,
      avatar_url: data.avatar_url,
      password: data.password,
      github_id: data.type === 'github' ? data.id : undefined,
      github_link: data.type === 'github' ? data.github_link : undefined,
      bio: data.type === 'github' ? data.bio : undefined,
      google_id: data.type === 'google' ? data.id : undefined,
    });
  }
}
