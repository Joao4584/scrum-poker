import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UlidService } from '@/shared/ulid/ulid.service';

export type IntegrationProvider = 'google' | 'github';

export interface IntegrationUser {
  type: IntegrationProvider;
  email: string;
  name: string;
  avatar_url: string;
  password?: string;
  id?: string;
  github_link?: string;
  bio?: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  avatar_url?: string;
  password?: string;
  github_id?: string;
  github_link?: string;
  bio?: string;
  google_id?: string;
}

@Injectable()
export class UserTypeOrmRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly ulidService: UlidService,
  ) {}

  async create(data: CreateUserInput): Promise<User> {
    const newUser = this.userRepository.create({
      public_id: this.ulidService.generateId(),
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

  async searchByName(term: string, limit = 10): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select(['user.public_id', 'user.name', 'user.email', 'user.avatar_url'])
      .where('user.name ILIKE :term OR user.email ILIKE :term', {
        term: `%${term}%`,
      })
      .take(limit)
      .getMany();
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
