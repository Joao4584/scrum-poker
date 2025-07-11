import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: HookHandlerDoneFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret',
      );
      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
