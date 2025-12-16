import { api } from "@/modules/shared/http/api-client";

interface GetUserOutput {
  name: string;
  email: string;
  avatar_url: string;
  public_id: string;
}

type ApiResponse<T> = {
  data: T;
};

export async function getUser(): Promise<GetUserOutput> {
  const response = await api.get("user/me").json<ApiResponse<GetUserOutput>>();
  return response.data;
}
