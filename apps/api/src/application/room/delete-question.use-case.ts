import { Inject, Injectable } from '@nestjs/common';
import {
  QUESTION_REPOSITORY,
  QuestionRepository,
} from '@/domain/room/repositories/question.repository';

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const question = await this.questionRepository.findByPublicId(publicId);

    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.delete(question.id);
  }
}
