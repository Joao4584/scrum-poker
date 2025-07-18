import { QuestionRepository } from '@/infrastructure/repositories/question.repository';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateQuestionUseCase {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async execute(publicId: string, data: UpdateQuestionRequest): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: { public_id: publicId },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    await this.questionRepository.update(question.id, data);
  }
}
