import { api } from "@/modules/shared/http/api-client";

export type SearchUserResult = {
  public_id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  friendship?: {
    status: "none" | "pending_sent" | "pending_received" | "accepted";
    public_id?: string | null;
  };
};

export async function searchUsers(name: string, limit = 10) {
  return await api
    .get("user/search", {
      searchParams: {
        name,
        limit,
      },
    })
    .json<{ data: SearchUserResult[] }>();
}
