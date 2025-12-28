import { Injectable } from '@nestjs/common';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionTypeOrmRepository,
  ) {}

  async execute(publicId: string, data: UpdateQuestionRequest): Promise<void> {
    const question = await this.questionRepository.findByPublicId(publicId);

    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.update(question.id, data);
  }
}
