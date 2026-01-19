import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import '@fastify/cookie';
import * as jwt from 'jsonwebtoken';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

  async use(
    req: FastifyRequest,
    res: FastifyReply,
    next: HookHandlerDoneFunction,
  ) {
    const authHeader = req.headers.authorization;
    const cookieToken =
      typeof req.cookies?.['meta-session'] === 'string'
        ? req.cookies['meta-session']
        : undefined;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : cookieToken;

    if (!token) {
      throw AppErrors.unauthorized('Token nÃ£o fornecido');
    }

    try {
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret',
      );
      console.log('Decoded Token:', decoded);

      const user = await this.usersRepository.findByPublicId(decoded.public_id);

      const lastLoginIat =
        user?.last_login_iat !== null && user?.last_login_iat !== undefined
          ? BigInt(user.last_login_iat as any)
          : null;

      if (!user || (lastLoginIat && BigInt(decoded.iat) < lastLoginIat)) {
        console.log(
          'Invalid or expired token: User not found or token expired',
        );
        throw AppErrors.unauthorized('Token invÃ¡lido ou expirado');
      }

      req['user'] = user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).raw = (req as any).raw || {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).raw.user = user;
      next();
    } catch (error) {
      console.log('JWT Verification Error:', error.message);
      throw AppErrors.unauthorized('Token invÃ¡lido ou expirado');
    }
  }
}
