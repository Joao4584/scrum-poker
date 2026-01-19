import { CreateRoomRequest } from '@/presentation/requests/room/create-room.request';
import { ListRecentRoomsQuery } from '@/presentation/requests/room/list-recent-rooms.request';

export const RoomDocs = {
  tags: 'Rooms',
  bearer: true,
  create: {
    operation: { summary: 'Create a room' },
    body: {
      type: CreateRoomRequest,
      examples: {
        public: {
          summary: 'Public room',
          value: {
            name: 'Planning Poker',
            description: 'Estimativas do sprint',
            public: true,
            voting_scale: 'FIBONACCI',
          },
        },
        private: {
          summary: 'Private room',
          value: {
            name: 'Backlog Grooming',
            public: false,
          },
        },
      },
    },
    response: {
      status: 201,
      description: 'Room created',
      schema: {
        example: {
          message: 'Sala criada com sucesso!',
          room: {
            public_id: 'room_01HZX...',
            name: 'Planning Poker',
            is_public: true,
          },
        },
      },
    },
  },
  recent: {
    operation: { summary: 'List recent rooms' },
    query: { type: ListRecentRoomsQuery },
    response: {
      status: 200,
      description: 'Recent rooms list',
      schema: {
        example: {
          data: [
            {
              public_id: 'room_01HZX...',
              name: 'Planning Poker',
              is_public: true,
            },
          ],
        },
      },
    },
  },
  get: {
    operation: { summary: 'Get room by public id' },
    param: { name: 'public_id', description: 'Room public id' },
    response: {
      status: 200,
      description: 'Room data',
      schema: {
        example: {
          public_id: 'room_01HZX...',
          name: 'Planning Poker',
          is_public: true,
        },
      },
    },
  },
  remove: {
    operation: { summary: 'Delete room by public id' },
    param: { name: 'public_id', description: 'Room public id' },
    response: {
      status: 204,
      description: 'Room deleted',
      schema: { example: null },
    },
  },
  favorite: {
    operation: { summary: 'Toggle room favorite' },
    param: { name: 'public_id', description: 'Room public id' },
    response: {
      status: 200,
      description: 'Favorite toggled',
      schema: {
        example: {
          liked: true,
          message: 'Sala favoritada',
        },
      },
    },
  },
};
