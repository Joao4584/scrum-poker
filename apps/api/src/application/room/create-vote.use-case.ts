import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { VoteTypeOrmRepository } from '@/infrastructure/repositories/vote.repository';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { User } from '@/infrastructure/entities/user.entity';

@Injectable()
export class CreateVoteUseCase {
  constructor(
    private readonly questionRepository: QuestionTypeOrmRepository,
    private readonly voteRepository: VoteTypeOrmRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(
    questionPublicId: string,
    value: string,
    user: User,
  ): Promise<Vote> {
    const question = await this.questionRepository.findByPublicId(
      questionPublicId,
    );

    if (!question) {
      throw new Error('Question not found');
    }

    return this.voteRepository.create({
      public_id: this.ulidService.generateId(),
      value,
      question_id: question.id,
      user_id: user.id,
    });
  }
}
