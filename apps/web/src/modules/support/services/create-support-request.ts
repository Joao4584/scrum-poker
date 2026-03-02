import { api } from "@/modules/shared/http/api-client";

interface CreateSupportRequestInput {
  subject: string;
  message: string;
  rating: number;
}

export interface SupportItem {
  public_id: string;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
}

interface CreateSupportRequestResponse {
  message: string;
  support: SupportItem;
}

export async function createSupportRequest(data: CreateSupportRequestInput) {
  return await api
    .post("support", {
      json: data,
    })
    .json<CreateSupportRequestResponse>();
}
