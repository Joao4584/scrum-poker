import { SendFriendRequest } from '@/presentation/requests/friend/send-friend-request.request';

export const FriendDocs = {
  tags: 'Friends',
  bearer: true,
  list: {
    operation: { summary: 'List friends and recent requests' },
    response: {
      status: 200,
      description: 'Friends and pending requests',
      schema: {
        example: {
          recent_requests: [
            {
              public_id: 'fr_01HZX...',
              status: 'pending_received',
              created_at: '2026-02-27T10:00:00.000Z',
              accepted_at: null,
              user: {
                public_id: 'usr_01HZX...',
                name: 'Jane Doe',
                email: 'jane@example.com',
                avatar_url: 'https://example.com/avatar.png',
              },
            },
          ],
          friends: [
            {
              public_id: 'fr_01HZY...',
              status: 'accepted',
              created_at: '2026-02-20T10:00:00.000Z',
              accepted_at: '2026-02-20T11:00:00.000Z',
              user: {
                public_id: 'usr_01HZY...',
                name: 'John Doe',
                email: 'john@example.com',
                avatar_url: 'https://example.com/avatar-2.png',
              },
            },
          ],
        },
      },
    },
  },
  request: {
    operation: { summary: 'Send friend request' },
    body: { type: SendFriendRequest },
    response: {
      status: 201,
      description: 'Friend request created',
      schema: {
        example: {
          public_id: 'fr_01HZX...',
          status: 'pending',
        },
      },
    },
  },
  accept: {
    operation: { summary: 'Accept friend request' },
    param: { name: 'public_id', description: 'Friend request public id' },
    response: {
      status: 200,
      description: 'Friend request accepted',
      schema: {
        example: {
          public_id: 'fr_01HZX...',
          status: 'accepted',
        },
      },
    },
  },
  remove: {
    operation: { summary: 'Remove friend or cancel request' },
    param: { name: 'public_id', description: 'Friend request public id' },
    response: {
      status: 204,
      description: 'Friendship removed',
      schema: { example: null },
    },
  },
};
