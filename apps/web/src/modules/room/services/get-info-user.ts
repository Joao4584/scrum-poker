import type { ApiResponse } from "@/modules/shared/@types/api-response";
import { api } from "@/modules/shared/http/api-client";

export interface InfoUserOutput {
  public_id: string;
  name: string;
  avatar_url: string | null;
  description: string;
  xp: number;
  level: number;
  member_since: string;
  platform_time_days: number;
}

export async function getInfoUser(publicId: string): Promise<InfoUserOutput> {
  const normalizedPublicId = publicId?.trim();
  if (!normalizedPublicId) {
    throw new Error("public_id is required");
  }

  const response = await api
    .get(`user/${normalizedPublicId}/info`)
    .json<ApiResponse<InfoUserOutput>>();

  return response.data;
}
