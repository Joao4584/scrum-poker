import { api } from "@/modules/shared/http/api-client";

type VerifyRoomPasswordResponse = {
  authorized: boolean;
  accessToken?: string;
  expiresIn?: string;
};

export async function verifyRoomPassword(roomPublicId: string, password: string) {
  return api.post(`room/${roomPublicId}/verify-password`, { json: { password } }).json<VerifyRoomPasswordResponse>();
}

type VerifyRoomAccessTokenResponse = {
  authorized: boolean;
};

export async function verifyRoomAccessToken(roomPublicId: string, accessToken: string) {
  return api.post(`room/${roomPublicId}/verify-access-token`, { json: { accessToken } }).json<VerifyRoomAccessTokenResponse>();
}
