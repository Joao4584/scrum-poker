import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateVoteUseCase } from '@/application/room/create-vote.use-case';
import { UpdateVoteUseCase } from '@/application/room/update-vote.use-case';
import { DeleteVoteUseCase } from '@/application/room/delete-vote.use-case';
import { CreateVoteRequest } from '@/presentation/requests/room/create-vote.request';
import { UpdateVoteRequest } from '@/presentation/requests/room/update-vote.request';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';

@Controller('questions/:question_public_id/votes')
export class VoteController {
  constructor(
    private readonly createVoteUseCase: CreateVoteUseCase,
    private readonly updateVoteUseCase: UpdateVoteUseCase,
    private readonly deleteVoteUseCase: DeleteVoteUseCase,
  ) {}

  @Post()
  async create(
    @Param('question_public_id') questionPublicId: string,
    @Body() body: CreateVoteRequest,
    @User() user: UserEntity,
  ) {
    return this.createVoteUseCase.execute(questionPublicId, body.value, user);
  }

  @Patch(':public_id')
  async update(
    @Param('public_id') publicId: string,
    @Body() body: UpdateVoteRequest,
  ) {
    return this.updateVoteUseCase.execute(publicId, body);
  }

  @Delete(':public_id')
  async delete(@Param('public_id') publicId: string) {
    return this.deleteVoteUseCase.execute(publicId);
  }
}
