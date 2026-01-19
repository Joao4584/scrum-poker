import { CreateQuestionRequest } from '@/presentation/requests/room/create-question.request';
import { UpdateQuestionRequest } from '@/presentation/requests/room/update-question.request';

export const QuestionDocs = {
  tags: 'Questions',
  bearer: true,
  create: {
    operation: { summary: 'Create question' },
    param: { name: 'room_public_id', description: 'Room public id' },
    body: { type: CreateQuestionRequest },
    response: {
      status: 201,
      description: 'Question created',
      schema: {
        example: {
          public_id: 'q_01HZX...',
          title: 'Quantos pontos?',
          is_active: true,
        },
      },
    },
  },
  update: {
    operation: { summary: 'Update question' },
    param: { name: 'public_id', description: 'Question public id' },
    body: { type: UpdateQuestionRequest },
    response: {
      status: 200,
      description: 'Question updated',
      schema: {
        example: {
          public_id: 'q_01HZX...',
          is_active: false,
          revealed: true,
        },
      },
    },
  },
  remove: {
    operation: { summary: 'Delete question' },
    param: { name: 'public_id', description: 'Question public id' },
    response: {
      status: 200,
      description: 'Question deleted',
      schema: { example: { success: true } },
    },
  },
};
