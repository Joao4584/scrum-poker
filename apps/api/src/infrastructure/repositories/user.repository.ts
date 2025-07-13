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

  async insertUser(data: IntegrationUserRequest): Promise<User> {
    const newUser = this.user_repository.create({
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

  async loadUserIntegration(
    data: IntegrationUserRequest,
  ): Promise<User | undefined> {
    if (data.type === 'github') {
      return this.user_repository.findOne({
        where: { github_id: String(data.id) },
      });
    }
    if (data.type === 'google') {
      return this.user_repository.findOne({
        where: { google_id: String(data.id) },
      });
    }
    return undefined;
  }

  async userExists(user_id: number): Promise<boolean> {
    const user = await this.user_repository.findOne({ where: { id: user_id } });
    return !!user;
  }
}
