import { api } from "@/modules/shared/http/api-client";

export type ToggleRoomFavoriteResponse = {
  liked: boolean;
  favorite_public_id?: string;
};

export async function toggleRoomFavorite(
  publicId: string,
): Promise<ToggleRoomFavoriteResponse> {
  return api.post(`room/${publicId}/favorite`).json<ToggleRoomFavoriteResponse>();
}
