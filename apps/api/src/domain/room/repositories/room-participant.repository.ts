import { RoomParticipant } from '@/infrastructure/entities/room-participant.entity';

export const ROOM_PARTICIPANT_REPOSITORY = 'ROOM_PARTICIPANT_REPOSITORY';

export interface CreateRoomParticipantInput {
  public_id: string;
  room_id: number;
  user_id: number;
  joined_at: Date;
  is_admin?: boolean;
}

export interface RoomParticipantRepository {
  create(data: CreateRoomParticipantInput): Promise<RoomParticipant>;
  findByRoomAndUser(
    room_id: number,
    user_id: number,
  ): Promise<RoomParticipant | null>;
}
