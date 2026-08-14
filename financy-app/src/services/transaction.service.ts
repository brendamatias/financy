import { api } from "./api";

const DOMAIN = "transactions";

const get = ({
  page,
  pageSize,
  searchQuery,
  type,
  categoryId,
  period,
}: TransactionFilters): Promise<WithPagination<Transaction>> => {
  const params = new URLSearchParams();

  if (page) params.append("page", String(page));
  if (pageSize) params.append("pageSize", String(pageSize));
  if (searchQuery) params.append("searchQuery", searchQuery);
  if (type) params.append("type", type);
  if (categoryId) params.append("categoryId", categoryId);
  if (period) params.append("period", period);

  return api.get(`${DOMAIN}?${params.toString()}`);
};

const getPeriods = (): Promise<string[]> => {
  return api.get(`${DOMAIN}/periods`);
};

const create = (payload: CreateTransactionRequest): Promise<void> => {
  return api.post(DOMAIN, payload);
};

const destroy = (id: string): Promise<void> => {
  return api.delete(`${DOMAIN}/${id}`);
};

const TransactionService = {
  get,
  create,
  destroy,
  periods: {
    get: getPeriods,
  },
};

export { TransactionService };
