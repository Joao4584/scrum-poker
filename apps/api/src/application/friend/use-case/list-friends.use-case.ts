import { Injectable } from '@nestjs/common';
import { FriendsTypeOrmRepository } from '@/infrastructure/repositories/friends.repository';

@Injectable()
export class ListFriendsUseCase {
  constructor(private readonly friendsRepository: FriendsTypeOrmRepository) {}

  async execute(user_id: number) {
    const relationships = await this.friendsRepository.listByUserId(user_id);

    const normalized = relationships.map((relationship) => {
      const isRequester = relationship.user_id === user_id;
      const otherUser = isRequester ? relationship.friend : relationship.user;
      const status = relationship.accepted_at
        ? 'accepted'
        : isRequester
          ? 'pending_sent'
          : 'pending_received';

      return {
        public_id: relationship.public_id,
        status,
        created_at: relationship.created_at,
        accepted_at: relationship.accepted_at ?? null,
        user: {
          public_id: otherUser.public_id,
          name: otherUser.name,
          email: otherUser.email,
          avatar_url: otherUser.avatar_url,
        },
      };
    });

    const recent_requests = normalized.filter(
      (relationship) => relationship.status !== 'accepted',
    );
    const friends = normalized.filter(
      (relationship) => relationship.status === 'accepted',
    );

    return {
      recent_requests: recent_requests.sort((a, b) => {
        if (a.status === 'pending_received' && b.status !== 'pending_received') {
          return -1;
        }
        if (a.status !== 'pending_received' && b.status === 'pending_received') {
          return 1;
        }
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }),
      friends: friends.sort(
        (a, b) =>
          new Date(b.accepted_at ?? b.created_at).getTime() -
          new Date(a.accepted_at ?? a.created_at).getTime(),
      ),
    };
  }
}
