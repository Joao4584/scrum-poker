import {
  Body,
  Controller,
  Get,
  Inject,
  Req,
  Request,
  Res,
} from '@nestjs/common';
import { FindOrCreateLobbyUseCase } from '../useCases/find-or-create-lobby';
import { ValidationRequestPipe } from 'modules/shared/pipe/validation-request.pipe';
import { Response } from 'express';

@Controller('lobby/join')
export class JoinLobbyController {
  constructor(
    @Inject(FindOrCreateLobbyUseCase)
    private readonly findOrCreateLobbyUseCase: FindOrCreateLobbyUseCase,
  ) {}
  @Get()
  async joinLobby(@Req() req: Request, @Res() res: Response) {
    const userId = req['user']?.id;

    const lobby = await this.findOrCreateLobbyUseCase.execute(userId);
    return res.json({
      uuid: lobby.uuid,
    });
  }
}
