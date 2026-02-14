import { Injectable } from '@nestjs/common';
import { FriendsTypeOrmRepository } from '@/infrastructure/repositories/friends.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class AcceptFriendRequestUseCase {
  constructor(private readonly friendsRepository: FriendsTypeOrmRepository) {}

  async execute(user_id: number, public_id: string) {
    const request = await this.friendsRepository.findByPublicId(public_id);
    if (!request) {
      throw AppErrors.notFound('Solicitação não encontrada');
    }

    if (request.friend_id !== user_id) {
      throw AppErrors.forbidden('Você não pode aceitar esta solicitação');
    }

    if (request.accepted_at) {
      throw AppErrors.conflict('Solicitação já aceita');
    }

    await this.friendsRepository.update(request.id, {
      accepted_at: new Date(),
    });

    return {
      public_id: request.public_id,
      status: 'accepted',
    };
  }
}
