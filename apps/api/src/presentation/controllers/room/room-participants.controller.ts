import { Controller, Post, Param, Inject } from '@nestjs/common';
import { JoinRoomUseCase } from '@/application/room/join-room.use-case';
import { User } from '@/presentation/decorators/user.decorator';

@Controller('room/:room_public_id/participants')
export class RoomParticipantsController {
  constructor(
    @Inject(JoinRoomUseCase) private readonly joinRoomUseCase: JoinRoomUseCase,
  ) {}

  @Post('join')
  async joinRoom(
    @Param('room_public_id') room_public_id: string,
    @User() user: { id: number },
  ) {
    return await this.joinRoomUseCase.execute(room_public_id, user.id);
  }
}
