import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { CreateRoomRequest } from '@/presentation/requests/room/create-room.request';
import { CreateRoomUseCase } from '@/application/room/create-room.use-case';
import { GetRoomUseCase } from '@/application/room/get-room.use-case';
import { DeleteRoomUseCase } from '@/application/room/delete-room.use-case';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { User } from '@/presentation/decorators/user.decorator';

@Controller('room')
export class RoomController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly getRoomUseCase: GetRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
  ) {}

  @Post()
  async createRoom(
    @Body(ValidationRequestPipe) data: CreateRoomRequest,
    @User() user: UserEntity,
  ) {
    const room = await this.createRoomUseCase.execute({
      ...data,
      owner_id: user.id,
    });
    return { message: 'Sala criada com sucesso!', room };
  }

  @Get(':public_id')
  async getRoom(@Param('public_id') public_id: string) {
    const room = await this.getRoomUseCase.execute(public_id);
    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }
    return room;
  }

  @Delete(':public_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(@Param('public_id') public_id: string) {
    await this.deleteRoomUseCase.execute(public_id);
  }
}
