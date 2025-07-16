import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) {
    const { method, originalUrl, params, query, body } = req;

    this.logger.log(`📢 [${method}] ${originalUrl}`);
    if (params && Object.keys(params).length)
      this.logger.warn('🟡 Params:', params);
    if (query && Object.keys(query).length) this.logger.log('🔵 Query:', query);
    if (body && Object.keys(body).length) this.logger.log('🟢 Body:', body);

    next();
  }
}
