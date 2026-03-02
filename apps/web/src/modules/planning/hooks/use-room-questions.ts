import { useQuery } from "@tanstack/react-query";
import { getRoomQuestions } from "../services/get-room-questions";

export function useRoomQuestions(roomPublicId: string) {
  return useQuery({
    queryKey: ["planning:questions", roomPublicId],
    queryFn: () => getRoomQuestions(roomPublicId),
    enabled: Boolean(roomPublicId),
  });
}
