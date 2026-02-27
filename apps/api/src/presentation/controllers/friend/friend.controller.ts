import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { SendFriendRequest } from '@/presentation/requests/friend/send-friend-request.request';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { SendFriendRequestUseCase } from '@/application/friend/use-case/send-friend-request.use-case';
import { AcceptFriendRequestUseCase } from '@/application/friend/use-case/accept-friend-request.use-case';
import { DeleteFriendUseCase } from '@/application/friend/use-case/delete-friend.use-case';
import { ListFriendsUseCase } from '@/application/friend/use-case/list-friends.use-case';
import { FriendDocs } from './friend.doc';

@ApiTags(FriendDocs.tags)
@ApiBearerAuth()
@Controller('friends')
export class FriendController {
  constructor(
    private readonly sendFriendRequestUseCase: SendFriendRequestUseCase,
    private readonly acceptFriendRequestUseCase: AcceptFriendRequestUseCase,
    private readonly deleteFriendUseCase: DeleteFriendUseCase,
    private readonly listFriendsUseCase: ListFriendsUseCase,
  ) {}

  @Get()
  @ApiOperation(FriendDocs.list.operation)
  @ApiResponse(FriendDocs.list.response)
  async list(@User() user: UserEntity) {
    return await this.listFriendsUseCase.execute(user.id);
  }

  @Post('requests')
  @ApiOperation(FriendDocs.request.operation)
  @ApiBody(FriendDocs.request.body)
  @ApiResponse(FriendDocs.request.response)
  async requestFriend(
    @Body(ValidationRequestPipe) body: SendFriendRequest,
    @User() user: UserEntity,
  ) {
    return await this.sendFriendRequestUseCase.execute(
      user.id,
      body.friend_public_id,
    );
  }

  @Patch(':public_id/accept')
  @ApiOperation(FriendDocs.accept.operation)
  @ApiParam(FriendDocs.accept.param)
  @ApiResponse(FriendDocs.accept.response)
  async accept(@Param('public_id') public_id: string, @User() user: UserEntity) {
    return await this.acceptFriendRequestUseCase.execute(user.id, public_id);
  }

  @Delete(':public_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation(FriendDocs.remove.operation)
  @ApiParam(FriendDocs.remove.param)
  @ApiResponse(FriendDocs.remove.response)
  async remove(@Param('public_id') public_id: string, @User() user: UserEntity) {
    await this.deleteFriendUseCase.execute(user.id, public_id);
  }
}
