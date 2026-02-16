export const UpdateUserXpDocs = {
  tags: 'User',
  bearer: true,
  operation: { summary: 'Add XP to current user' },
  body: {
    schema: {
      example: {
        amount: 50,
      },
    },
  },
  response: {
    status: 200,
    description: 'Updated user xp',
    schema: {
      example: {
        data: {
          xp: 450,
        },
      },
    },
  },
};
