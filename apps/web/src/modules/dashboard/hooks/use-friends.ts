import { useQuery } from "@tanstack/react-query";
import { getListFriends } from "../services/get-list-friends";

interface UseUsersProps {
  page: number;
  filters: any;
}

export function useListFriends({ page, filters }: UseUsersProps) {
  return useQuery({
    queryKey: [
      "table:services-panel",
      {
        page,
        filters,
      },
    ],
    queryFn: async () => {
      const parsedFilters = filters?.fields?.length ? filters : undefined;

      const servicesData = await getListFriends({
        // page,
        filters: parsedFilters,
      });

      return servicesData;
    },
  });
}
