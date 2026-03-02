import { api } from "@/modules/shared/http/api-client";

export async function acceptFriendRequest(public_id: string) {
  return await api.patch(`friends/${public_id}/accept`).json<{
    public_id: string;
    status: "accepted";
  }>();
}
