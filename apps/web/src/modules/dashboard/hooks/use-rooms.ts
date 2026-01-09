import { useQuery } from "@tanstack/react-query";
import { getRooms, type GetRoomsOptions } from "../services/get-rooms";

export function useGetRooms(options?: GetRoomsOptions) {
  const sortKey = options?.sort ?? "recent";
  return useQuery({
    queryKey: ["rooms:list", sortKey],
    queryFn: () => getRooms(options),
  });
}
