import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVoteUseCase } from '@/application/room/create-vote.use-case';
import { UpdateVoteUseCase } from '@/application/room/update-vote.use-case';
import { DeleteVoteUseCase } from '@/application/room/delete-vote.use-case';
import { CreateVoteRequest } from '@/presentation/requests/room/create-vote.request';
import { UpdateVoteRequest } from '@/presentation/requests/room/update-vote.request';
import { VoteDocs } from './vote.doc';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';

@ApiTags(VoteDocs.tags)
@ApiBearerAuth()
@Controller('questions/:question_public_id/votes')
export class VoteController {
  constructor(
    private readonly createVoteUseCase: CreateVoteUseCase,
    private readonly updateVoteUseCase: UpdateVoteUseCase,
    private readonly deleteVoteUseCase: DeleteVoteUseCase,
  ) {}

  @Post()
  @ApiOperation(VoteDocs.create.operation)
  @ApiParam(VoteDocs.create.param)
  @ApiBody(VoteDocs.create.body)
  @ApiResponse(VoteDocs.create.response)
  async create(
    @Param('question_public_id') questionPublicId: string,
    @Body() body: CreateVoteRequest,
    @User() user: UserEntity,
  ) {
    return this.createVoteUseCase.execute(questionPublicId, body.value, user);
  }

  @Patch(':public_id')
  @ApiOperation(VoteDocs.update.operation)
  @ApiParam(VoteDocs.update.param)
  @ApiBody(VoteDocs.update.body)
  @ApiResponse(VoteDocs.update.response)
  async update(
    @Param('public_id') publicId: string,
    @Body() body: UpdateVoteRequest,
  ) {
    return this.updateVoteUseCase.execute(publicId, body);
  }

  @Delete(':public_id')
  @ApiOperation(VoteDocs.remove.operation)
  @ApiParam(VoteDocs.remove.param)
  @ApiResponse(VoteDocs.remove.response)
  async delete(@Param('public_id') publicId: string) {
    return this.deleteVoteUseCase.execute(publicId);
  }
}

