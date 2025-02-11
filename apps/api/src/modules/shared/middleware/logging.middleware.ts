import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, params, query, body } = req;

    console.log('');
    console.log(`📢 [${method}] ${originalUrl}`);
    if (Object.keys(params).length) console.log('🟡 Params:', params);
    if (Object.keys(query).length) console.log('🔵 Query:', query);
    if (Object.keys(body).length) console.log('🟢 Body:', body);

    next();
  }
}
