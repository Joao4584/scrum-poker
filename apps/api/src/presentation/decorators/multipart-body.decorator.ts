import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const MultipartBody = createParamDecorator((_data: unknown, ctx: ExecutionContext): FastifyRequest => {
  return ctx.switchToHttp().getRequest<FastifyRequest>();
});
