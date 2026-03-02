import { api } from "@/modules/shared/http/api-client";

export async function deleteFriendRequest(public_id: string) {
  await api.delete(`friends/${public_id}`);
}
