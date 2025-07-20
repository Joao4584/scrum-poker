import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) {
    const { method, originalUrl, body } = req;

    let logMessage = `➡️  [${method}] ${originalUrl}`;

    if (method === 'POST' && body) {
      const requestBody = JSON.stringify(body);
      logMessage += ` - Body: ${requestBody}`;
    }

    this.logger.log(logMessage);

    next();
  }
}
