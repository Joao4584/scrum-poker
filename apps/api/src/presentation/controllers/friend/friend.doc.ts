import { SendFriendRequest } from '@/presentation/requests/friend/send-friend-request.request';

export const FriendDocs = {
  tags: 'Friends',
  bearer: true,
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
