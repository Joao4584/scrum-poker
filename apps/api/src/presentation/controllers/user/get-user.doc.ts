export const GetUserDocs = {
  tags: 'User',
  bearer: true,
  operation: { summary: 'Get current user profile' },
  response: {
    status: 200,
    description: 'User profile data',
    schema: {
      example: {
        data: {
          name: 'Joao',
          email: 'joao@example.com',
          avatar_url: 'https://example.com/avatar.png',
          public_id: 'usr_01HZX...',
          character_key: 'steve',
          xp: 400,
        },
      },
    },
  },
};
