import { Injectable } from '@nestjs/common';
import { FriendsTypeOrmRepository } from '@/infrastructure/repositories/friends.repository';
import { AppErrors } from '@/presentation/errors';

@Injectable()
export class DeleteFriendUseCase {
  constructor(private readonly friendsRepository: FriendsTypeOrmRepository) {}

  async execute(user_id: number, public_id: string) {
    const request = await this.friendsRepository.findByPublicId(public_id);
    if (!request) {
      throw AppErrors.notFound('Amizade não encontrada');
    }

    if (request.user_id !== user_id && request.friend_id !== user_id) {
      throw AppErrors.forbidden('Você não pode remover esta amizade');
    }

    await this.friendsRepository.softDelete(request.id);
  }
}
