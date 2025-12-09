import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    // Fastify typings omit custom properties; middleware attaches `user`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (request as any).user ?? (request as any).raw?.user;
  },
);
