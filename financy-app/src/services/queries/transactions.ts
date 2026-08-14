import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { TransactionService } from "../transaction.service";

export const transactionKeys = {
  all: ["transactions"] as const,
  list: (filters: TransactionFilters) =>
    [...transactionKeys.all, "list", filters] as const,
  periods: () => [...transactionKeys.all, "periods"] as const,
};

export const useTransactions = ({
  page = 1,
  pageSize = 10,
  searchQuery,
  type,
  categoryId,
  period,
}: TransactionFilters) => {
  const filters = { page, pageSize, searchQuery, type, categoryId, period };

  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () =>
      TransactionService.get(filters).catch((error: string) => {
        toast.error(error);
        throw error;
      }),
  });
};

export const useTransactionPeriods = () => {
  return useQuery({
    queryKey: transactionKeys.periods(),
    queryFn: () =>
      TransactionService.periods.get().catch((error: string) => {
        toast.error(error);
        throw error;
      }),
  });
};
