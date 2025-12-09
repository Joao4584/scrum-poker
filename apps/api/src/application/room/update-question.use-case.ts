import { Inject, Injectable } from '@nestjs/common';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';
import {
  QUESTION_REPOSITORY,
  QuestionRepository,
} from '@/domain/room/repositories/question.repository';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(publicId: string, data: UpdateQuestionRequest): Promise<void> {
    const question = await this.questionRepository.findByPublicId(publicId);

    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.update(question.id, data);
  }
}
