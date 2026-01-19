import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { AppErrors } from '@/presentation/errors';
import { GetUserDocs } from './get-user.doc';

@ApiTags(GetUserDocs.tags)
@ApiBearerAuth()
@Controller('user/me')
export class GetUserController {
  @Get()
  @ApiOperation(GetUserDocs.operation)
  @ApiResponse(GetUserDocs.response)
  async getUser(@User() user: UserEntity) {
    if (!user) {
      throw AppErrors.unauthorized('Usuário não autenticado');
    }
    return {
      data: {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        public_id: user.public_id,
      },
    };
  }
}
