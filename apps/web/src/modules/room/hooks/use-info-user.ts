import { useQuery } from "@tanstack/react-query";
import { getInfoUser } from "../services/get-info-user";

export function useInfoUser(publicId?: string | null) {
  return useQuery({
    queryKey: ["user:info", publicId],
    enabled: !!publicId,
    queryFn: async () => {
      return await getInfoUser(publicId!);
    },
  });
}
