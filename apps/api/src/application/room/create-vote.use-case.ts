import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '@/infrastructure/repositories/question.repository';
import { VoteRepository } from '@/infrastructure/repositories/vote.repository';
import { UlidService } from '@/shared/ulid/ulid.service';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { User } from '@/infrastructure/entities/user.entity';

@Injectable()
export class CreateVoteUseCase {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly voteRepository: VoteRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(
    questionPublicId: string,
    value: string,
    user: User,
  ): Promise<Vote> {
    const question = await this.questionRepository.findOne({
      where: { public_id: questionPublicId },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    const vote = new Vote();
    vote.public_id = this.ulidService.generateId();
    vote.value = value;
    vote.question = question;
    vote.user = user;

    return this.voteRepository.save(vote);
  }
}
