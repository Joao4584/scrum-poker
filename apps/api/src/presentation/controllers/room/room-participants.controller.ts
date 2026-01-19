import { Controller, Post, Param, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoinRoomUseCase } from '@/application/room/join-room.use-case';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { RoomParticipantsDocs } from './room-participants.doc';

@ApiTags(RoomParticipantsDocs.tags)
@ApiBearerAuth()
@Controller('room/:room_public_id/participants')
export class RoomParticipantsController {
  constructor(
    @Inject(JoinRoomUseCase) private readonly joinRoomUseCase: JoinRoomUseCase,
  ) {}

  @Post('join')
  @ApiOperation(RoomParticipantsDocs.join.operation)
  @ApiParam(RoomParticipantsDocs.join.param)
  @ApiResponse(RoomParticipantsDocs.join.response)
  async joinRoom(
    @Param('room_public_id') room_public_id: string,
    @User() user: UserEntity,
  ) {
    return await this.joinRoomUseCase.execute(room_public_id, user.id);
  }
}
