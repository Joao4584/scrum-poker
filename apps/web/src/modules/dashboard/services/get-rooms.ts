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
}

export async function getRooms(
  options: GetRoomsOptions = {},
): Promise<RoomListItem[]> {
  return api
    .get("room/recent", {
      searchParams: options.sort ? { sort: options.sort } : undefined,
    })
    .json<RoomListItem[]>();
}
