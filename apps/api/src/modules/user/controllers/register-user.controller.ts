import { Controller, Post, Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { RegisterUserRequest } from '../requests/register-user.request';
import { ValidationRequestPipe } from 'modules/shared/pipe/validation-request.pipe';

@Controller('user')
export class RegisterUserController {
  @Post()
  async createUser(
    @Body(new ValidationRequestPipe()) RegisterUserRequest: RegisterUserRequest,
  ) {
    return {
      message: 'Usuário criado com sucesso!',
      data: RegisterUserRequest,
    };
  }
}
