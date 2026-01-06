import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { api } from "@/modules/shared/http/api-client";

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

export async function getRooms(): Promise<RoomListItem[]> {
  return api.get("room/recent").json<RoomListItem[]>();
}
