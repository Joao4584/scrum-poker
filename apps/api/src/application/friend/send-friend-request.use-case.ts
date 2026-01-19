import { Injectable } from '@nestjs/common';
import { UlidService } from '@/shared/ulid/ulid.service';
import { FriendsTypeOrmRepository } from '@/infrastructure/repositories/friends.repository';
import { UserTypeOrmRepository } from '@/infrastructure/repositories/user.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class SendFriendRequestUseCase {
  constructor(
    private readonly friendsRepository: FriendsTypeOrmRepository,
    private readonly usersRepository: UserTypeOrmRepository,
    private readonly ulidService: UlidService,
  ) {}

  async execute(user_id: number, friend_public_id: string) {
    const friend = await this.usersRepository.findByPublicId(friend_public_id);
    if (!friend) {
      throw AppErrors.notFound('Usuário não encontrado');
    }

    if (friend.id === user_id) {
      throw AppErrors.badRequest('Você não pode adicionar a si mesmo');
    }

    const existing = await this.friendsRepository.findByUsers(
      user_id,
      friend.id,
    );
    if (existing) {
      if (existing.accepted_at) {
        throw AppErrors.conflict('Vocês já são amigos');
      }
      if (existing.user_id === user_id) {
        throw AppErrors.conflict('Solicitação já enviada');
      }
      throw AppErrors.conflict('Você já tem uma solicitação pendente');
    }

    const public_id = this.ulidService.generateId();
    const request = await this.friendsRepository.create({
      public_id,
      user_id,
      friend_id: friend.id,
    });

    return {
      public_id: request.public_id,
      status: 'pending',
    };
  }
}
