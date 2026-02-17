import { Controller, Post, Body, Get, Param, Delete, HttpCode, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { CreateRoomRequest } from '@/presentation/requests/room/create-room.request';
import { ListRecentRoomsQuery } from '@/presentation/requests/room/list-recent-rooms.request';
import { CreateRoomUseCase } from '@/application/room/use-case/create-room.use-case';
import { GetRoomUseCase } from '@/application/room/use-case/get-room.use-case';
import { DeleteRoomUseCase } from '@/application/room/use-case/delete-room.use-case';
import { ListUserRoomsUseCase } from '@/application/room/use-case/list-user-rooms.use-case';
import { ToggleRoomFavoriteUseCase } from '@/application/room/use-case/toggle-room-favorite.use-case';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { User } from '@/presentation/decorators/user.decorator';
import { AppErrors } from '@/presentation/errors';
import { RoomDocs } from './room.doc';

@ApiTags(RoomDocs.tags)
@ApiBearerAuth()
@Controller('room')
export class RoomController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly getRoomUseCase: GetRoomUseCase,
    private readonly deleteRoomUseCase: DeleteRoomUseCase,
    @Inject(ListUserRoomsUseCase)
    private readonly listUserRoomsUseCase: ListUserRoomsUseCase,
    private readonly toggleRoomFavoriteUseCase: ToggleRoomFavoriteUseCase,
  ) {}

  @Post()
  @ApiOperation(RoomDocs.create.operation)
  @ApiBody(RoomDocs.create.body)
  @ApiResponse(RoomDocs.create.response)
  async createRoom(@Body(ValidationRequestPipe) data: CreateRoomRequest, @User() user: UserEntity) {
    const room = await this.createRoomUseCase.execute({
      ...data,
      owner_id: user.id,
      is_public: data.public,
    });
    const roomResponse = { ...room } as Record<string, unknown>;
    delete roomResponse.owner_id;
    delete roomResponse.owner;
    delete roomResponse.password;
    delete roomResponse.id;

    return { message: 'Sala criada com sucesso!', room: roomResponse };
  }

  @Get('recent')
  @ApiOperation(RoomDocs.recent.operation)
  @ApiQuery(RoomDocs.recent.query)
  @ApiResponse(RoomDocs.recent.response)
  async getRecentRooms(@User() user: { id: number }, @Query(ValidationRequestPipe) query: ListRecentRoomsQuery) {
    return await this.listUserRoomsUseCase.execute(user.id, query);
  }

  @Get(':public_id')
  @ApiOperation(RoomDocs.get.operation)
  @ApiParam(RoomDocs.get.param)
  @ApiResponse(RoomDocs.get.response)
  async getRoom(@Param('public_id') public_id: string) {
    const room = await this.getRoomUseCase.execute(public_id);
    if (!room) {
      throw AppErrors.notFound('Sala nao encontrada');
    }
    return room;
  }

  @Delete(':public_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation(RoomDocs.remove.operation)
  @ApiParam(RoomDocs.remove.param)
  @ApiResponse(RoomDocs.remove.response)
  async deleteRoom(@Param('public_id') public_id: string) {
    await this.deleteRoomUseCase.execute(public_id);
  }

  @Post(':public_id/favorite')
  @ApiOperation(RoomDocs.favorite.operation)
  @ApiParam(RoomDocs.favorite.param)
  @ApiResponse(RoomDocs.favorite.response)
  async toggleFavoriteRoom(@Param('public_id') public_id: string, @User() user: UserEntity) {
    if (!user) {
      throw AppErrors.unauthorized('Usuario nao autenticado');
    }
    const result = await this.toggleRoomFavoriteUseCase.execute(public_id, user);
    return {
      message: result.liked ? 'Sala favoritada' : 'Favorito removido',
      ...result,
    };
  }
}
