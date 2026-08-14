import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { TransactionService } from "../transaction.service";
import { categoryKeys } from "../queries/categories";
import { dashboardKeys } from "../queries/dashboard";
import { transactionKeys } from "../queries/transactions";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransactionRequest) =>
      TransactionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("Transação criada com sucesso.");
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TransactionService.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success("Transação excluída com sucesso.");
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};
