import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IntegrationUserRequest } from '../../presentation/requests/user/integration-user.request';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly user_repository: Repository<User>,
  ) {}

  async insertUser(
    data: IntegrationUserRequest & { public_id: string },
  ): Promise<User> {
    const newUser = this.user_repository.create({
      public_id: data.public_id,
      email: data.email,
      name: data.name || 'Unknown',
      avatar_url: data.avatar_url,
      github_id: data.type === 'github' ? String(data.id) : undefined,
      github_link: data.type === 'github' ? data.github_link : undefined,
      bio: data.type === 'github' ? data.bio : undefined,
      google_id: data.type === 'google' ? data.id : undefined,
    });
    return this.user_repository.save(newUser);
  }

  async findOneByPublicId(public_id: string): Promise<User | undefined> {
    return this.user_repository.findOne({ where: { public_id } });
  }

  async loadUserIntegration(
    integrationData: IntegrationUserRequest,
  ): Promise<User | undefined> {
    const { type, id } = integrationData;

    const query = {
      where: {
        [`${type}_id`]: String(id),
      },
    };

    return this.user_repository.findOne(query);
  }

  async userExists(user_id: number): Promise<boolean> {
    const user = await this.user_repository.findOne({ where: { id: user_id } });
    return !!user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    await this.user_repository.update(id, data);
    return this.user_repository.findOneByOrFail({ id });
  }
}
