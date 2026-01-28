import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { AppErrors } from '@/presentation/errors';
import { GetUserDocs } from './get-user.doc';
import { UpdateUserCharacterDocs } from './update-user-character.doc';
import { UpdateUserCharacterRequest } from '@/presentation/requests/user/update-user-character.request';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';

@ApiTags(GetUserDocs.tags)
@ApiBearerAuth()
@Controller('user/me')
export class GetUserController {
  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

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
        character_key: user.character_key,
      },
    };
  }

  @Patch('character')
  @ApiOperation(UpdateUserCharacterDocs.operation)
  @ApiBody(UpdateUserCharacterDocs.body)
  @ApiResponse(UpdateUserCharacterDocs.response)
  async updateCharacter(
    @Body(ValidationRequestPipe) body: UpdateUserCharacterRequest,
    @User() user: UserEntity,
  ) {
    if (!user) {
      throw AppErrors.unauthorized('UsuÃ¡rio nÃ£o autenticado');
    }

    const updated = await this.usersRepository.update(user.id, {
      character_key: body.character_key,
    });

    return {
      data: {
        character_key: updated.character_key,
      },
    };
  }
}
