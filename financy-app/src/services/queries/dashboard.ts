import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { DashboardService } from "../dashboard.service";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () =>
      DashboardService.summary.get().catch((error: string) => {
        toast.error(error);
        throw error;
      }),
  });
};
