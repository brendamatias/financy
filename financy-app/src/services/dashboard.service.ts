import { api } from "./api";

const DOMAIN = "dashboard";

const getSummary = (): Promise<DashboardSummary> => {
  return api.get(`${DOMAIN}/summary`);
};

const DashboardService = {
  summary: {
    get: getSummary,
  },
};

export { DashboardService };
