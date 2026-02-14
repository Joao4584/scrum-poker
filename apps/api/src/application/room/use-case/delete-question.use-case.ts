import { Injectable } from '@nestjs/common';
import { QuestionTypeOrmRepository } from '@/infrastructure/repositories/question.repository';

@Injectable()
export class DeleteQuestionUseCase {
  constructor(
    private readonly questionRepository: QuestionTypeOrmRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const question = await this.questionRepository.findByPublicId(publicId);

    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.delete(question.id);
  }
}
