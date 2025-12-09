import { Controller, Get } from '@nestjs/common';
import { User } from '@/presentation/decorators/user.decorator';
import { User as UserEntity } from '@/infrastructure/entities/user.entity';

@Controller('user')
export class GetUserController {
  @Get()
  async getUser(@User() user: UserEntity) {
    if (!user) {
      return { data: null };
    }
    return {
      data: user,
    };
  }
}
