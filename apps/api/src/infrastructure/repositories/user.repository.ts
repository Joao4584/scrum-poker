import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  CreateUserInput,
  UserRepository,
} from '@/domain/user/user.repository';
import { IntegrationUser } from '@/domain/user/integration-user';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create({
      public_id: data.public_id,
      email: data.email,
      name: data.name || 'Unknown',
      avatar_url: data.avatar_url,
      github_id: data.github_id,
      github_link: data.github_link,
      bio: data.bio,
      google_id: data.google_id,
      password: data.password,
    });
    const saved = await this.userRepository.save(newUser);
    return saved;
  }

  async findByPublicId(public_id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { public_id } });
    return user;
  }

  async findByIntegration(data: IntegrationUser): Promise<User | null> {
    const { type, id } = data;
    if (!id) {
      return null;
    }

    const query = {
      where: {
        [`${type}_id`]: String(id),
      },
    };

    const user = await this.userRepository.findOne(query);
    return user;
  }

  async exists(user_id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    return !!user;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    const user = await this.userRepository.findOneByOrFail({ id });
    return user;
  }
}
