export interface GenericList<T> {
  data: T[];
  meta: {
    per_page: number;
    current_page: number;
    total: number;
  };
}
