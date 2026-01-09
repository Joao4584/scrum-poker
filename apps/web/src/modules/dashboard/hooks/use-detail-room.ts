import { useQuery } from "@tanstack/react-query";
import { getRoomDetail } from "../services/get-room-detail";

export function useDetailRoom(publicId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["rooms:detail", publicId],
    queryFn: () => getRoomDetail(publicId as string),
    enabled: Boolean(publicId) && enabled,
  });
}
