import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { CategoryService } from "../category.service";
import { categoryKeys } from "../queries/categories";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) =>
      CategoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Categoria criada com sucesso.");
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CategoryService.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Categoria excluída com sucesso.");
    },
    onError: (error: string) => {
      toast.error(error);
    },
  });
};
