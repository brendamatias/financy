interface Pagination {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  sortBy?: string;
}

interface PaginationMeta {
  __typename?: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface WithPagination<T> {
  __typename?: string;
  data: T[];
  meta: PaginationMeta;
}
