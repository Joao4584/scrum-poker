import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import * as jwt from 'jsonwebtoken';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@/domain/user/user.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepository,
  ) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction,
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppErrors.unauthorized('Token não fornecido');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret',
      );
      console.log('Decoded Token:', decoded);

      const user = await this.usersRepository.findByPublicId(decoded.public_id);
      console.log('Found User:', user);

      const lastLoginIat =
        user?.last_login_iat !== null && user?.last_login_iat !== undefined
          ? BigInt(user.last_login_iat as any)
          : null;

      if (!user || (lastLoginIat && BigInt(decoded.iat) < lastLoginIat)) {
        console.log(
          'Invalid or expired token: User not found or token expired',
        );
        throw AppErrors.unauthorized('Token inválido ou expirado');
      }

      req['user'] = user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).raw = (req as any).raw || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).raw.user = user;
      next();
    } catch (error) {
      console.log('JWT Verification Error:', error.message);
      throw AppErrors.unauthorized('Token inválido ou expirado');
    }
  }
}
