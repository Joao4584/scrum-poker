import { Injectable } from '@nestjs/common';
import { RoomTypeOrmRepository } from '@/infrastructure/repositories/room.repository';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';

@Injectable()
export class ListRoomQuestionsUseCase {
  constructor(
    private readonly roomRepository: RoomTypeOrmRepository,
    private readonly questionRepository: QuestionTypeOrmRepository,
  ) {}

  async execute(roomPublicId: string) {
    const room = await this.roomRepository.findByPublicId(roomPublicId);

    if (!room) {
      throw new Error('Room not found');
    }

    const questions = await this.questionRepository.findByRoomId(room.id);

    return questions.map((question) => ({
      public_id: question.public_id,
      text: question.text,
      revealed: question.revealed,
      is_active: question.is_active,
      created_at: question.created_at,
      updated_at: question.updated_at,
      votes_count: question.votes?.length ?? 0,
      voters:
        question.votes?.map((vote) => ({
          public_id: vote.user.public_id,
          name: vote.user.name,
          avatar_url: vote.user.avatar_url ?? null,
          value: vote.value,
          voted_at: vote.created_at,
        })) ?? [],
    }));
  }
}
