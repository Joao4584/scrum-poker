import { api } from "@/modules/shared/http/api-client";

export type FriendRelationshipStatus = "pending_sent" | "pending_received" | "accepted";

export interface FriendRelationshipItem {
  public_id: string;
  status: FriendRelationshipStatus;
  created_at: string;
  accepted_at: string | null;
  user: {
    public_id: string;
    name: string;
    email: string;
    avatar_url?: string | null;
  };
}

export interface ListFriendsOutput {
  recent_requests: FriendRelationshipItem[];
  friends: FriendRelationshipItem[];
}

export async function getListFriends() {
  return await api.get("friends").json<ListFriendsOutput>();
}
