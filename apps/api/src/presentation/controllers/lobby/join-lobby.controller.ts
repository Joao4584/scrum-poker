import {
  Body,
  Controller,
  Get,
  Inject,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import { FindOrCreateLobbyUseCase } from '@/application/lobby/find-or-create-lobby.use-case';
import { FastifyReply } from 'fastify';

@Controller('lobby/join')
export class JoinLobbyController {
  constructor(
    @Inject(FindOrCreateLobbyUseCase)
    private readonly findOrCreateLobbyUseCase: FindOrCreateLobbyUseCase,
  ) {}
  @Get()
  async joinLobby(@Req() req: Request, @Res() res: FastifyReply) {
    const user_id = req['user']?.id;

    const lobby = await this.findOrCreateLobbyUseCase.execute(user_id);
    return res.send({
      uuid: lobby.uuid,
    });
  }
}