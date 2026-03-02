import { getUser } from "../services/get-user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUser();
    },
  });
}
