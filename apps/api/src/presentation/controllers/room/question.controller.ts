import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionUseCase } from '@/application/room/use-case/create-question.use-case';
import { DeleteQuestionUseCase } from '@/application/room/use-case/delete-question.use-case';
import { ListRoomQuestionsUseCase } from '@/application/room/use-case/list-room-questions.use-case';
import { UpdateQuestionUseCase } from '@/application/room/use-case/update-question.use-case';
import { CreateQuestionRequest } from '@/presentation/requests/room/create-question.request';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';
import { QuestionDocs } from './question.doc';

@ApiTags(QuestionDocs.tags)
@ApiBearerAuth()
@Controller('rooms/:room_public_id/questions')
export class QuestionController {
  constructor(
    private readonly listRoomQuestionsUseCase: ListRoomQuestionsUseCase,
    private readonly createQuestionUseCase: CreateQuestionUseCase,
    private readonly updateQuestionUseCase: UpdateQuestionUseCase,
    private readonly deleteQuestionUseCase: DeleteQuestionUseCase,
  ) {}

  @Get()
  @ApiOperation(QuestionDocs.list.operation)
  @ApiParam(QuestionDocs.list.param)
  @ApiResponse(QuestionDocs.list.response)
  async list(@Param('room_public_id') roomPublicId: string) {
    return this.listRoomQuestionsUseCase.execute(roomPublicId);
  }

  @Post()
  @ApiOperation(QuestionDocs.create.operation)
  @ApiParam(QuestionDocs.create.param)
  @ApiBody(QuestionDocs.create.body)
  @ApiResponse(QuestionDocs.create.response)
  async create(
    @Param('room_public_id') roomPublicId: string,
    @Body() body: CreateQuestionRequest,
  ) {
    return this.createQuestionUseCase.execute(roomPublicId, body.title);
  }

  @Patch(':public_id')
  @ApiOperation(QuestionDocs.update.operation)
  @ApiParam(QuestionDocs.update.param)
  @ApiBody(QuestionDocs.update.body)
  @ApiResponse(QuestionDocs.update.response)
  async update(
    @Param('public_id') publicId: string,
    @Body() body: UpdateQuestionRequest,
  ) {
    return this.updateQuestionUseCase.execute(publicId, body);
  }

  @Delete(':public_id')
  @ApiOperation(QuestionDocs.remove.operation)
  @ApiParam(QuestionDocs.remove.param)
  @ApiResponse(QuestionDocs.remove.response)
  async delete(@Param('public_id') publicId: string) {
    return this.deleteQuestionUseCase.execute(publicId);
  }
}

