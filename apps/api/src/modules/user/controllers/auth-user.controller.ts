import { Controller, Post, Body, Inject } from '@nestjs/common';
import { RegisterUserRequest } from '../requests/register-user.request';
import { ValidationRequestPipe } from 'modules/shared/pipe/validation-request.pipe';
import { CreateUserUseCase } from 'modules/user/useCases/create-user';

@Controller('user/integration')
export class RegisterIntegrationUserController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async createUser(
    @Body(new ValidationRequestPipe()) registerUserRequest: RegisterUserRequest,
  ) {
    const user = await this.createUserUseCase.execute(registerUserRequest);
    return {
      message: 'Usuário criado com sucesso!',
      data: user,
    };
  }
}
