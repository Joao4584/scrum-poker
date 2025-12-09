import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from '@/infrastructure/entities/vote.entity';
import {
  CreateVoteInput,
  VoteRepository,
} from '@/domain/room/repositories/vote.repository';

@Injectable()
export class VoteTypeOrmRepository implements VoteRepository {
  constructor(
    @InjectRepository(Vote)
    private readonly repository: Repository<Vote>,
  ) {}

  async create(data: CreateVoteInput): Promise<Vote> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    return saved;
  }

  async findByPublicId(public_id: string): Promise<Vote | null> {
    const vote = await this.repository.findOne({
      where: { public_id },
    });
    return vote;
  }

  async update(id: number, data: Partial<Vote>): Promise<void> {
    await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
