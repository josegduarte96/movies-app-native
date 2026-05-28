export interface Paginated<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}
