import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friends } from '@/infrastructure/entities/friends.entity';

export interface CreateFriendInput {
  public_id: string;
  user_id: number;
  friend_id: number;
}

@Injectable()
export class FriendsTypeOrmRepository {
  constructor(
    @InjectRepository(Friends)
    private readonly repository: Repository<Friends>,
  ) {}

  async create(data: CreateFriendInput): Promise<Friends> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findByPublicId(public_id: string): Promise<Friends | null> {
    return await this.repository.findOne({
      where: { public_id },
    });
  }

  async findByUsers(
    user_id: number,
    friend_id: number,
  ): Promise<Friends | null> {
    return await this.repository.findOne({
      where: [
        { user_id, friend_id },
        { user_id: friend_id, friend_id: user_id },
      ],
      withDeleted: false,
    });
  }

  async update(id: number, data: Partial<Friends>): Promise<void> {
    await this.repository.update(id, data);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findRelationships(
    user_id: number,
    friendIds: number[],
  ): Promise<Friends[]> {
    if (friendIds.length === 0) return [];

    return await this.repository
      .createQueryBuilder('friends')
      .where(
        '(friends.user_id = :user_id AND friends.friend_id IN (:...friendIds))',
        { user_id, friendIds },
      )
      .orWhere(
        '(friends.friend_id = :user_id AND friends.user_id IN (:...friendIds))',
        { user_id, friendIds },
      )
      .andWhere('friends.deleted_at IS NULL')
      .getMany();
  }
}
