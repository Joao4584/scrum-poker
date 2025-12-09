import { Inject, Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import {
  ROOM_REPOSITORY,
  RoomRepository,
} from '@/domain/room/repositories/room.repository';
import {
  QUESTION_REPOSITORY,
  QuestionRepository,
} from '@/domain/room/repositories/question.repository';
import { Question } from '@/infrastructure/entities/question.entity';

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    @Inject(ROOM_REPOSITORY) private readonly roomRepository: RoomRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: QuestionRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(roomPublicId: string, title: string): Promise<Question> {
    const room = await this.roomRepository.findByPublicId(roomPublicId);

    if (!room) {
      throw new Error('Room not found');
    }

    return this.questionRepository.create({
      public_id: this.ulidService.generateId(),
      text: title,
      room_id: room.id,
    });
  }
}
