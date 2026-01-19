import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { AppErrors } from '@/presentation/errors';
import { SearchUserDocs } from './search-user.doc';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { FriendsTypeOrmRepository } from '@/infrastructure/repositories/friends.repository';

@ApiTags(SearchUserDocs.tags)
@ApiBearerAuth()
@Controller('user/search')
export class SearchUserController {
  constructor(
    private readonly usersRepository: UserTypeOrmRepository,
    private readonly friendsRepository: FriendsTypeOrmRepository,
  ) {}

  @Get()
  @ApiOperation(SearchUserDocs.operation)
  @ApiQuery(SearchUserDocs.queryName)
  @ApiQuery(SearchUserDocs.queryLimit)
  @ApiResponse(SearchUserDocs.response)
  async search(
    @User() user: UserEntity,
    @Query('name') name: string,
    @Query('limit') limit?: string,
  ) {
    const parsedName = name?.trim();
    if (!parsedName || parsedName.length < 2) {
      throw AppErrors.badRequest('Informe pelo menos 2 caracteres');
    }

    const parsedLimit = limit ? Number(limit) : 10;
    const results = await this.usersRepository.searchByName(
      parsedName,
      Number.isFinite(parsedLimit) ? parsedLimit : 10,
    );

    const friendIds = results.map((item) => item.id);
    const relationships = await this.friendsRepository.findRelationships(
      user.id,
      friendIds,
    );
    const relationshipMap = new Map<number, { status: string; public_id?: string }>();
    for (const relationship of relationships) {
      const otherUserId =
        relationship.user_id === user.id
          ? relationship.friend_id
          : relationship.user_id;
      const status = relationship.accepted_at
        ? 'accepted'
        : relationship.user_id === user.id
          ? 'pending_sent'
          : 'pending_received';
      relationshipMap.set(otherUserId, {
        status,
        public_id: relationship.public_id,
      });
    }

    return {
      data: results
        .filter((item) => item.id !== user.id)
        .map((item) => ({
          public_id: item.public_id,
          name: item.name,
          email: item.email,
          avatar_url: item.avatar_url,
          friendship: relationshipMap.get(item.id) ?? {
            status: 'none',
            public_id: null,
          },
        })),
    };
  }
}
