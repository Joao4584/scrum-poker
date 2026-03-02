import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { Question } from '@/infrastructure/entities/question.entity';
import { PlanningGateway } from '@/presentation/gateways/planning/planning.gateway';
import { ListRoomQuestionsUseCase } from './list-room-questions.use-case';

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private readonly roomRepository: RoomTypeOrmRepository,
    private readonly questionRepository: QuestionTypeOrmRepository,
    private readonly ulidService: UlidService,
    private readonly planningGateway: PlanningGateway,
    private readonly listRoomQuestionsUseCase: ListRoomQuestionsUseCase,
  ) {}

  async execute(roomPublicId: string, title: string): Promise<Question> {
    const room = await this.roomRepository.findByPublicId(roomPublicId);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const activeQuestion = await this.questionRepository.findActiveByRoomId(room.id);

    if (activeQuestion) {
      throw new ConflictException('There is already an active question in this room');
    }

    const question = await this.questionRepository.create({
      public_id: this.ulidService.generateId(),
      text: title,
      room_id: room.id,
      is_active: true,
    });
    const questions = await this.listRoomQuestionsUseCase.execute(room.public_id);

    this.planningGateway.emitRoomSync(room.public_id, 'question.created', {
      questionPublicId: question.public_id,
      questions,
    });

    return question;
  }
}
