import type { ApiResponse } from "@/modules/shared/@types/api-response";
import { api } from "@/modules/shared/http/api-client";

interface GetUserOutput {
  name: string;
  email: string;
  avatar_url: string;
  public_id: string;
  character_key: string | null;
  xp: number;
}

export async function getUser(): Promise<GetUserOutput> {
  const response = await api.get("user/me").json<ApiResponse<GetUserOutput>>();
  return response.data;
}
