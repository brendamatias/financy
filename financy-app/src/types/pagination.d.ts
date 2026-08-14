interface Pagination {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  sortBy?: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface WithPagination<T> {
  data: T[];
  meta: PaginationMeta;
}
