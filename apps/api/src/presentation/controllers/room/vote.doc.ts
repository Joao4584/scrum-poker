import { CreateVoteRequest } from '@/presentation/requests/room/create-vote.request';
import { UpdateVoteRequest } from '@/presentation/requests/room/update-vote.request';

export const VoteDocs = {
  tags: 'Votes',
  bearer: true,
  create: {
    operation: { summary: 'Create vote' },
    param: { name: 'question_public_id', description: 'Question public id' },
    body: { type: CreateVoteRequest },
    response: {
      status: 201,
      description: 'Vote created',
      schema: {
        example: {
          public_id: 'vote_01HZX...',
          value: '5',
        },
      },
    },
  },
  update: {
    operation: { summary: 'Update vote' },
    param: { name: 'public_id', description: 'Vote public id' },
    body: { type: UpdateVoteRequest },
    response: {
      status: 200,
      description: 'Vote updated',
      schema: {
        example: {
          public_id: 'vote_01HZX...',
          value: '8',
        },
      },
    },
  },
  remove: {
    operation: { summary: 'Delete vote' },
    param: { name: 'public_id', description: 'Vote public id' },
    response: {
      status: 200,
      description: 'Vote deleted',
      schema: { example: { success: true } },
    },
  },
};
