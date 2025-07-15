import { Controller, Post, Body } from '@nestjs/common';
import { RegisterUserRequest } from '@/presentation/requests/user/register-user.request';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';

@Controller('user')
export class RegisterUserController {
  @Post()
  async createUser(
    @Body(ValidationRequestPipe) registerUserRequest: RegisterUserRequest,
  ) {
    return {
      message: 'Usuário criado com sucesso!',
      data: registerUserRequest,
    };
  }
}
