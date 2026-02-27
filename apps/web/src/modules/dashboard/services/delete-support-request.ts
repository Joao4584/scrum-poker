import { api } from "@/modules/shared/http/api-client";

export async function deleteSupportRequest(publicId: string) {
  await api.delete(`support/${publicId}`);
}
