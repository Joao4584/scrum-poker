import type { ApiResponse } from "@/modules/shared/@types/api-response";
import { api } from "@/modules/shared/http/api-client";

interface UpdateUserCharacterInput {
  character_key: string;
}

interface UpdateUserCharacterOutput {
  character_key: string;
}

export async function updateUserCharacter(
  data: UpdateUserCharacterInput,
): Promise<UpdateUserCharacterOutput> {
  const response = await api
    .patch("user/me/character", { json: data })
    .json<ApiResponse<UpdateUserCharacterOutput>>();
  return response.data;
}
