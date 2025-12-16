import { Controller, Get } from '@nestjs/common';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';
import { AppErrors } from '@/presentation/errors';

@Controller('user/me')
export class GetUserController {
  @Get()
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
