import type { GenericList } from "../@types/ky";

export function handle404TableError<T>(): GenericList<T> {
  return {
    data: [],
    meta: {
      per_page: 0,
      current_page: 0,
      total: 0,
    },
  };
}
