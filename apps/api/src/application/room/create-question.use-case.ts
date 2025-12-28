import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';
import { Question } from '@/infrastructure/entities/question.entity';

@Injectable()
export class CreateQuestionUseCase {
  constructor(
    private readonly roomRepository: RoomTypeOrmRepository,
    private readonly questionRepository: QuestionTypeOrmRepository,
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
