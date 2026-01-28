export const UpdateUserCharacterDocs = {
  tags: 'User',
  bearer: true,
  operation: { summary: 'Update current user character key' },
  body: {
    schema: {
      example: {
        character_key: 'jerry',
      },
    },
  },
  response: {
    status: 200,
    description: 'Updated user character key',
    schema: {
      example: {
        data: {
          character_key: 'jerry',
        },
      },
    },
  },
};
