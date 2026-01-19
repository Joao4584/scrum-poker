import type { IncomingMessage } from 'http';
import * as jwt from 'jsonwebtoken';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';

type JwtPayload = {
  public_id: string;
  iat: number;
};

function extractBearer(value: string | undefined) {
  if (!value) return null;
  if (value.startsWith('Bearer ')) {
    return value.split(' ')[1];
  }
  return value;
}

export function extractTokenFromRequest(request: IncomingMessage): string | null {
  const headerValue = request.headers.authorization;
  const headerToken = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const url = new URL(request.url ?? '/', 'http://localhost');
  const queryToken = url.searchParams.get('token') ?? undefined;

  return extractBearer(headerToken ?? queryToken) ?? null;
}

export async function authenticateDashboardRequest(
  request: IncomingMessage,
  usersRepository: UserTypeOrmRepository,
) {
  const token = extractTokenFromRequest(request);
  if (!token) return null;

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret',
    ) as JwtPayload;
  } catch {
    return null;
  }

  const user = await usersRepository.findByPublicId(decoded.public_id);
  const lastLoginIat =
    user?.last_login_iat !== null && user?.last_login_iat !== undefined
      ? BigInt(user.last_login_iat as any)
      : null;

  if (!user || (lastLoginIat && BigInt(decoded.iat) < lastLoginIat)) {
    return null;
  }

  return user;
}
