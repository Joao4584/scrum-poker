import { api } from "@/modules/shared/http/api-client";
import type { SupportItem } from "./create-support-request";

interface GetSupportRequestsResponse {
  data: SupportItem[];
}

export async function getSupportRequests() {
  return await api.get("support").json<GetSupportRequestsResponse>();
}
