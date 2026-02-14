import {
  Body,
  Controller,
  HttpStatus,
  HttpException,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { FastifyReply } from 'fastify';
import { CreateUserUseCase } from '@/application/user/use-case/create-user.use-case';
import { IntegrationUserRequest } from '@/presentation/requests/user/integration-user.request';
import { LoadUserIntegrationUseCase } from '@/application/user/use-case/load-user-integration.use-case';
import { CreateJwtUserUseCase } from '@/application/user/use-case/create-jwt-user.use-case';
import { AuthUserDocs } from './auth-user.doc';

@ApiTags(AuthUserDocs.tags)
@Controller('user/integration')
export class RegisterIntegrationUserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loadUserIntegrationUseCase: LoadUserIntegrationUseCase,
    private readonly createJwtUserUseCase: CreateJwtUserUseCase,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation(AuthUserDocs.operation)
  @ApiBody({ type: IntegrationUserRequest, ...AuthUserDocs.body })
  @ApiResponse(AuthUserDocs.response)
  async authUser(
    @Body() dataRequest: IntegrationUserRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    try {
      const existingUser = await this.loadUserIntegrationUseCase.execute(dataRequest);

      const user = existingUser ?? (await this.createUserUseCase.execute(dataRequest));
      const token = await this.createJwtUserUseCase.execute(user);

      res.setCookie('meta-session', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      });

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
