import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { PlanningGateway } from '@/presentation/gateways/planning/planning.gateway';
import { ListRoomQuestionsUseCase } from './list-room-questions.use-case';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionTypeOrmRepository,
    private readonly roomRepository: RoomTypeOrmRepository,
    private readonly planningGateway: PlanningGateway,
    private readonly listRoomQuestionsUseCase: ListRoomQuestionsUseCase,
  ) {}

  async execute(publicId: string, data: UpdateQuestionRequest): Promise<void> {
    const question = await this.questionRepository.findByPublicId(publicId);

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const normalizedData = {
      ...data,
      revealed: data.is_active === false ? true : data.revealed,
    };

    await this.questionRepository.update(question.id, normalizedData);

    const room = await this.roomRepository.findById(question.room_id);
    if (room) {
      const questions = await this.listRoomQuestionsUseCase.execute(room.public_id);
      this.planningGateway.emitRoomSync(room.public_id, 'question.updated', {
        questionPublicId: question.public_id,
        questions,
      });
    }
  }
}
