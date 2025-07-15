import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CreateUserUseCase } from '@/application/user/create-user.use-case';
import { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async authUser(
    @Body() dataRequest: IntegrationUserRequest,
    @Res() res: FastifyReply,
  ) {
    try {
      let user = await this.loadUserIntegrationUseCase.execute(dataRequest);
      console.log({ ...user, public_id: user?.public_id?.toString() });

      if (!user) {
        user = await this.createUserUseCase.execute(dataRequest);
      }

      const token = await this.createJwtUserUseCase.execute(user);

      return res.status(HttpStatus.OK).send({
        success: true,
        message: 'Logado com sucesso!',
        accessToken: token,
      });
    } catch (error) {
      return res
        .status(error.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR)
        .send({
          success: false,
          message: error.message || 'Ocorreu um erro inesperado',
        });
    }
  }
}
