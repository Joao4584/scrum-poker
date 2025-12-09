import { Room } from '@/infrastructure/entities/room.entity';
import { VotingScale } from '@/shared/enums/voting-scale.enum';

export const ROOM_REPOSITORY = 'ROOM_REPOSITORY';

export interface CreateRoomInput {
  public_id: string;
  name: string;
  description?: string | null;
  owner_id: number;
  is_public: boolean;
  voting_scale?: VotingScale | null;
  status?: string;
  password?: string | null;
}

export interface RoomRepository {
  create(data: CreateRoomInput): Promise<Room>;
  findByPublicId(public_id: string): Promise<Room | null>;
  deleteByPublicId(public_id: string): Promise<void>;
  findRecentByUserId(
    user_id: number,
    options: { order?: 'ASC' | 'DESC'; owner_only?: boolean },
  ): Promise<Room[]>;
}
