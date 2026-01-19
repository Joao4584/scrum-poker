export const AuthUserDocs = {
  tags: 'Auth',
  operation: { summary: 'Authenticate or register an integration user' },
  body: {
    examples: {
      google: {
        summary: 'Google integration',
        value: {
          type: 'google',
          email: 'joao@example.com',
          name: 'Joao',
          avatar_url: 'https://example.com/avatar.png',
          id: 'google-sub-id',
        },
      },
      github: {
        summary: 'GitHub integration',
        value: {
          type: 'github',
          email: 'joao@example.com',
          name: 'Joao',
          avatar_url: 'https://example.com/avatar.png',
          github_link: 'https://github.com/joao',
          bio: 'Fullstack dev',
        },
      },
    },
  },
  response: {
    status: 200,
    description: 'Access token issued',
    schema: {
      example: {
        success: true,
        message: 'Logado com sucesso!',
        accessToken: 'jwt-token',
      },
    },
  },
};
