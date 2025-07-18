import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from '@/infrastructure/entities/vote.entity';

@Injectable()
export class VoteRepository extends Repository<Vote> {
  constructor(
    @InjectRepository(Vote)
    private readonly repository: Repository<Vote>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
