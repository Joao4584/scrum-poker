import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationRequestPipe } from '@/shared/pipes/validation-request.pipe';
import { CreateUserUseCase } from '@/application/user/create-user.use-case';
import type { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
import { LoadUserIntegrationUseCase } from '@/application/user/load-user-integration.use-case';
import { CreateJwtUserUseCase } from '@/application/user/create-jwt-user.use-case';

@Controller('user/integration')
export class RegisterIntegrationUserController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(LoadUserIntegrationUseCase)
    private readonly loadUserIntegrationUseCase: LoadUserIntegrationUseCase,
    @Inject(CreateJwtUserUseCase)
    private readonly createJwtUserUseCase: CreateJwtUserUseCase,
  ) {}

  @Post()
  async authUser(
    @Body(new ValidationRequestPipe()) dataRequest: IntegrationUserRequest,
    @Res() res: Response,
  ) {
    try {
      let user = await this.loadUserIntegrationUseCase.execute(dataRequest);
      console.log(user);
      if (!user) {
        user = await this.createUserUseCase.execute(dataRequest);
      }

      const token = await this.createJwtUserUseCase.execute(user);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Logado com sucesso!',
        accessToken: token,
      });
    } catch (error) {
      return res
        .status(error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: error.message || 'Ocorreu um erro inesperado',
        });
    }
  }
}
