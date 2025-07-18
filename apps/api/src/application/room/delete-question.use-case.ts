import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '@/infrastructure/repositories/question.repository';

@Injectable()
export class DeleteQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(publicId: string): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: { public_id: publicId },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.delete(question.id);
  }
}
