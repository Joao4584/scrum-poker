import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateQuestionUseCase } from '@/application/room/create-question.use-case';
import { DeleteQuestionUseCase } from '@/application/room/delete-question.use-case';
import { UpdateQuestionUseCase } from '@/application/room/update-question.use-case';
import { CreateQuestionRequest } from '@/presentation/requests/room/create-question.request';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';

@Controller('rooms/:room_public_id/questions')
export class QuestionController {
  constructor(
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    private readonly deleteQuestionUseCase: DeleteQuestionUseCase,
  ) {}

  @Post()
  async create(
    @Param('room_public_id') roomPublicId: string,
    @Body() body: CreateQuestionRequest,
  ) {
    return this.createQuestionUseCase.execute(roomPublicId, body.title);
  }

  @Patch(':public_id')
  async update(
    @Param('public_id') publicId: string,
    @Body() body: UpdateQuestionRequest,
  ) {
    return this.updateQuestionUseCase.execute(publicId, body);
  }

  @Delete(':public_id')
  async delete(@Param('public_id') publicId: string) {
    return this.deleteQuestionUseCase.execute(publicId);
  }
}
