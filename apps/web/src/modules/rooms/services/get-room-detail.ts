import type { VotingScale } from "@/modules/shared/enums/voting-scale.enum";
import { api } from "@/modules/shared/http/api-client";
import { normalizeApiImageUrl } from "./normalize-api-image-url";

export type RoomDetail = {
  public_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  voting_scale: VotingScale | null;
  status: string;
  url_image: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export async function getRoomDetail(publicId: string): Promise<RoomDetail> {
  const room = await api.get(`room/${publicId}`).json<RoomDetail>();
  return {
    ...room,
    url_image: normalizeApiImageUrl(room.url_image),
  };
}
