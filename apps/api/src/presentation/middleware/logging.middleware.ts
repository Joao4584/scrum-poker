import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) {
    const { method, originalUrl, params, query, body } = req;

    console.log('');
    console.log(`📢 [${method}] ${originalUrl}`);
    if (Object.keys(params).length) console.log('🟡 Params:', params);
    if (Object.keys(query).length) console.log('🔵 Query:', query);
    if (Object.keys(body).length) console.log('🟢 Body:', body);

    next();
  }
}
