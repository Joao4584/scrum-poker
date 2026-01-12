import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { api } from "@/modules/shared/http/api-client";

export type RoomSort = "recent" | "alphabetical" | "players";

export type GetRoomsOptions = {
  sort?: RoomSort;
};

export interface RoomListItem {
  public_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  voting_scale: VotingScale | null;
  status: string;
  created_at: string;
  updated_at: string;
  participants_count: number;
  is_favorite: boolean;
}

type RoomListItemApi = Omit<RoomListItem, "is_favorite"> & {
  is_favorite?: number | boolean;
};

export async function getRooms(options: GetRoomsOptions = {}): Promise<RoomListItem[]> {
  const rooms = await api
    .get("room/recent", {
      searchParams: options.sort ? { sort: options.sort } : undefined,
    })
    .json<RoomListItemApi[]>();

  return rooms.map((room) => ({
    ...room,
    is_favorite: Boolean(room.is_favorite),
  }));
}
