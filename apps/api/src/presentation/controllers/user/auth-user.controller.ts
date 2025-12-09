import {
  Body,
  Controller,
  HttpStatus,
  HttpException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserUseCase } from '@/application/user/create-user.use-case';
import { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
import { LoadUserIntegrationUseCase } from '@/application/user/load-user-integration.use-case';
import { CreateJwtUserUseCase } from '@/application/user/create-jwt-user.use-case';

@Controller('user/integration')
export class RegisterIntegrationUserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loadUserIntegrationUseCase: LoadUserIntegrationUseCase,
    private readonly createJwtUserUseCase: CreateJwtUserUseCase,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async authUser(@Body() dataRequest: IntegrationUserRequest) {
    try {
      const existingUser =
        await this.loadUserIntegrationUseCase.execute(dataRequest);

      const user =
        existingUser ?? (await this.createUserUseCase.execute(dataRequest));

      const token = await this.createJwtUserUseCase.execute(user);

      return {
        success: true,
        message: 'Logado com sucesso!',
        accessToken: token,
      };
    } catch (error) {
      if (error.getStatus?.()) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Ocorreu um erro inesperado ao autenticar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
