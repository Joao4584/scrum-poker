import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import * as jwt from 'jsonwebtoken';
import { UsersRepository } from '@/infrastructure/repositories/user.repository';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction,
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret',
      );

      const user = await this.usersRepository.findOneByPublicId(
        decoded.public_id,
      );
      console.log('a', user);

      if (
        !user ||
        (user.last_login_iat && BigInt(decoded.iat) < user.last_login_iat)
      ) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      req['user'] = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
