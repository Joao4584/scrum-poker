export const PingDocs = {
  tags: 'Health',
  bearer: true,
  operation: { summary: 'Check API authentication' },
  response: {
    status: 200,
    description: 'Authenticated response',
    schema: {
      example: {
        success: true,
        message: 'Pong! You are authenticated.',
        user: {
          public_id: 'usr_01HZX...',
          name: 'Joao',
          email: 'joao@example.com',
        },
      },
    },
  },
};
