import { Injectable } from '@nestjs/common';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { AppErrors } from '@/presentation/errors';

const LEVEL_XP = 45;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class GetPublicUserInfoUseCase {
  constructor(private readonly usersRepository: UserTypeOrmRepository) {}

  async execute(publicId: string) {
    const normalizedPublicId = publicId?.trim();
    if (!normalizedPublicId) {
      throw AppErrors.badRequest('public_id obrigatorio');
    }

    const user = await this.usersRepository.findPublicInfoByPublicId(normalizedPublicId);
    if (!user) {
      throw AppErrors.notFound('Usuario nao encontrado');
    }

    const xp = Math.max(0, Number(user.xp ?? 0));
    const level = Math.floor(xp / LEVEL_XP);
    const memberSince = user.created_at;
    const platformTimeDays = Math.max(
      0,
      Math.floor((Date.now() - new Date(memberSince).getTime()) / DAY_IN_MS),
    );

    return {
      public_id: user.public_id,
      name: user.name,
      avatar_url: user.avatar_url ?? null,
      description: user.bio ?? '',
      xp,
      level,
      member_since: memberSince.toISOString(),
      platform_time_days: platformTimeDays,
    };
  }
}
