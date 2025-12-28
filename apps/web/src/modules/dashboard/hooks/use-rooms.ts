import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../services/get-rooms";

export function useGetRooms() {
  return useQuery({
    queryKey: ["rooms:list"],
    queryFn: getRooms,
  });
}
