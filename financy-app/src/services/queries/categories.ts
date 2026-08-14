import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { CategoryService } from "../category.service";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  summary: () => [...categoryKeys.all, "summary"] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () =>
      CategoryService.get().catch((error: string) => {
        toast.error(error);
        throw error;
      }),
  });
};

export const useCategoriesSummary = () => {
  return useQuery({
    queryKey: categoryKeys.summary(),
    queryFn: () =>
      CategoryService.summary.get().catch((error: string) => {
        toast.error(error);
        throw error;
      }),
  });
};
