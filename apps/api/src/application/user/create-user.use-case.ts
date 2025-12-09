import { Inject, Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@/domain/user/user.repository';
import { IntegrationUser } from '@/domain/user/integration-user';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepository,
    @Inject(UlidService)
    private readonly ulidService: UlidService,
  ) {}

  async execute(data: IntegrationUser) {
    const public_id = this.ulidService.generateId();
    return await this.usersRepository.create({
      public_id,
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
