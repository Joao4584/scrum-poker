import { api } from "@/modules/shared/http/api-client";

export async function sendFriendRequest(friend_public_id: string) {
  return await api
    .post("friends/requests", {
      json: { friend_public_id },
    })
    .json<{ public_id: string; status: string }>();
}
