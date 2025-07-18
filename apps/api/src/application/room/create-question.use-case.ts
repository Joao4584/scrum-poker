import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '@/infrastructure/repositories/question.repository';
import { UlidService } from '@/shared/ulid/ulid.service';
import { Question } from '@/infrastructure/entities/question.entity';
import { RoomsRepository } from '@/infrastructure/repositories/room.repository';

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private readonly roomRepository: RoomsRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(roomPublicId: string, title: string): Promise<Question> {
    const room = await this.roomRepository.findRoomByPublicId(roomPublicId);

    if (!room) {
      throw new Error('Room not found');
    }

    const question = new Question();
    question.public_id = this.ulidService.generateId();
    question.text = title;
    question.room = room;

    return this.questionRepository.save(question);
  }
}
