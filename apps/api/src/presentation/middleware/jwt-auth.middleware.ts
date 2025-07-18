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
    console.log('Auth Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token not provided or invalid format');
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret',
      );
      console.log('Decoded Token:', decoded);

      const user = await this.usersRepository.findOneByPublicId(
        decoded.public_id,
      );
      console.log('Found User:', user);

      if (
        !user ||
        (user.last_login_iat && BigInt(decoded.iat) < user.last_login_iat)
      ) {
        console.log(
          'Invalid or expired token: User not found or token expired',
        );
        throw new UnauthorizedException('Invalid or expired token');
      }

      req['user'] = user;
      next();
    } catch (error) {
      console.log('JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
