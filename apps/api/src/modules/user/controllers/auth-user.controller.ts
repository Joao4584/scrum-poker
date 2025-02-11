import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserRequest } from '../requests/register-user.request';
import { ValidationRequestPipe } from 'modules/shared/pipe/validation-request.pipe';
import { CreateUserUseCase } from 'modules/user/useCases/create-user';
import type { IntegrationUserRequest } from '../requests/integration-user.request';
import { LoadUserIntegrationUseCase } from '../useCases/load-user-integration';

@Controller('user/integration')
export class RegisterIntegrationUserController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(LoadUserIntegrationUseCase)
    private readonly loadUserIntegrationUseCase: LoadUserIntegrationUseCase,
  ) {}

  @Post()
  async authUser(
    @Body(new ValidationRequestPipe()) DataRequest: IntegrationUserRequest,
    @Res() res: Response,
  ) {
    let existsUser = this.loadUserIntegrationUseCase.execute(DataRequest);
    if (!existsUser) {
      existsUser = this.createUserUseCase.execute(DataRequest);
    }

    return res.status(HttpStatus.OK).json({
      message: 'Logado com sucesso!',
      data: DataRequest,
    });
  }
}
