import { Controller, Post, Body } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register-user';
import { ValidationRequestPipe } from 'modules/common/pipe/validation-request.pipe';

@Controller('user')
export class RegisterUserController {
  @Post()
  async createUser(
    @Body(new ValidationRequestPipe()) RegisterUserDto: RegisterUserDto,
  ) {
    return { message: 'Usuário criado com sucesso!', data: RegisterUserDto };
  }
}
