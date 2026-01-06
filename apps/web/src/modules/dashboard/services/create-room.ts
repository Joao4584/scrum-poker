import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { api } from "@/modules/shared/http/api-client";

export type CreateRoomInput = {
  name: string;
  description?: string;
  public: boolean;
  voting_scale?: VotingScale;
};

export type CreateRoomResponse = {
  message: string;
  room: Record<string, unknown>;
};

export async function createRoom(data: CreateRoomInput) {
  return api.post("room", { json: data }).json<CreateRoomResponse>();
}
