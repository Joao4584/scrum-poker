export const RoomParticipantsDocs = {
  tags: 'Rooms',
  bearer: true,
  join: {
    operation: { summary: 'Join a room' },
    param: { name: 'room_public_id', description: 'Room public id' },
    response: {
      status: 200,
      description: 'Joined room',
      schema: {
        example: {
          success: true,
        },
      },
    },
  },
};
