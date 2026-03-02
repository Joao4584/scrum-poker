import { api } from "@/modules/shared/http/api-client";

export async function deleteRoom(publicId: string) {
  await api.delete(`room/${publicId}`);
}
