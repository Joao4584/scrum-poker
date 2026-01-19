export const SearchUserDocs = {
  tags: 'User',
  bearer: true,
  operation: { summary: 'Search users by name or email' },
  queryName: { name: 'name', required: true, description: 'Name or email to search' },
  queryLimit: { name: 'limit', required: false, description: 'Max results' },
  response: {
    status: 200,
    description: 'Users list',
    schema: {
      example: {
        data: [
          {
            public_id: 'usr_01HZX...',
            name: 'Joao',
            email: 'joao@example.com',
            avatar_url: 'https://example.com/avatar.png',
            friendship: {
              status: 'none',
              public_id: null,
            },
          },
        ],
      },
    },
  },
};
