import { useQuery } from "@tanstack/react-query";
import { getListFriends } from "../services/get-list-friends";

export function useListFriends() {
  return useQuery({
    queryKey: ["friends:list"],
    queryFn: getListFriends,
  });
}
