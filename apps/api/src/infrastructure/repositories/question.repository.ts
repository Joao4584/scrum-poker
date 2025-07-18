import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@/infrastructure/entities/question.entity';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  constructor(
    @InjectRepository(Question)
    private readonly repository: Repository<Question>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
