import type { GenericList } from "@/modules/shared/@types/ky";
import { handle404TableError } from "@/modules/shared/errors/handle-table-error";
import { api } from "@/modules/shared/http/api-client";
import { HTTPError } from "ky";

interface ListUsersInput {
  // pageSize?: number;
  // page?: number;
  filters?: Record<string, any>;
}

export interface FriendListTableOutput {
  name: string;
  email: string;
}
type ListUsersOutput = GenericList<FriendListTableOutput>;

export async function getListFriends({
  // pageSize = 10,
  // page = 1,
  filters,
  ...rest
}: ListUsersInput): Promise<ListUsersOutput> {
  try {
    // const response = await api.get("administrative/services", {
    //   searchParams: {
    //     pageSize,
    //     page,
    //     ...filters,
    //     ...rest,
    //   },
    // });
    // return response.json<ListUsersOutput>();

    return {
      data: [],
      meta: {
        per_page: 0,
        current_page: 0,
        total: 0,
      },
    };
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) {
      return handle404TableError();
    }

    throw error;
  }
}
