import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { JwtAuthMiddleware } from '../middleware/jwt-auth.middleware';
import { PingDocs } from './ping.doc';

@ApiTags(PingDocs.tags)
@ApiBearerAuth()
@Controller('ping')
@UseGuards(JwtAuthMiddleware)
export class PingController {
  @Get()
  @ApiOperation(PingDocs.operation)
  @ApiResponse(PingDocs.response)
  ping(@Req() req, @Res() res: FastifyReply) {
    return res.status(HttpStatus.OK).send({
      success: true,
      message: 'Pong! You are authenticated.',
      user: req.user,
    });
  }
}
