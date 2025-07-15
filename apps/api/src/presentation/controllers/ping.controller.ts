import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { JwtAuthMiddleware } from '../middleware/jwt-auth.middleware';

@Controller('ping')
@UseGuards(JwtAuthMiddleware)
export class PingController {
  @Get()
  ping(@Req() req, @Res() res: FastifyReply) {
    return res.status(HttpStatus.OK).send({
      success: true,
      message: 'Pong! You are authenticated.',
      user: req.user,
    });
  }
}
