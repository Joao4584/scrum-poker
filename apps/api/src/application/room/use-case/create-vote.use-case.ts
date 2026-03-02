import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { VoteTypeOrmRepository } from '@/infrastructure/repositories/vote.repository';
import { Vote } from '@/infrastructure/entities/vote.entity';
import { User } from '@/infrastructure/entities/user.entity';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { PlanningGateway } from '@/presentation/gateways/planning/planning.gateway';
import { ListRoomQuestionsUseCase } from './list-room-questions.use-case';

@Injectable()
export class CreateVoteUseCase {
  constructor(
    private readonly questionRepository: QuestionTypeOrmRepository,
    private readonly voteRepository: VoteTypeOrmRepository,
    private readonly ulidService: UlidService,
    private readonly roomRepository: RoomTypeOrmRepository,
    private readonly planningGateway: PlanningGateway,
    private readonly listRoomQuestionsUseCase: ListRoomQuestionsUseCase,
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
      throw new NotFoundException('Question not found');
    }

    if (!question.is_active) {
      throw new ConflictException('Question is not active');
    }

    const existingVote = await this.voteRepository.findByQuestionIdAndUserId(question.id, user.id);

    if (existingVote) {
      await this.voteRepository.update(existingVote.id, { value });
      const room = await this.roomRepository.findById(question.room_id);
      if (room) {
        const questions = await this.listRoomQuestionsUseCase.execute(room.public_id);
        this.planningGateway.emitRoomSync(room.public_id, 'vote.updated', {
          questionPublicId: question.public_id,
          userPublicId: user.public_id,
          questions,
        });
      }
      return {
        ...existingVote,
        value,
      };
    }

    const vote = await this.voteRepository.create({
      public_id: this.ulidService.generateId(),
      value,
      question_id: question.id,
      user_id: user.id,
    });

    const room = await this.roomRepository.findById(question.room_id);
    if (room) {
      const questions = await this.listRoomQuestionsUseCase.execute(room.public_id);
      this.planningGateway.emitRoomSync(room.public_id, 'vote.updated', {
        questionPublicId: question.public_id,
        userPublicId: user.public_id,
        questions,
      });
    }

    return vote;
  }
}
