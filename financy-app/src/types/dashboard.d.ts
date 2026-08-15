interface DashboardSummary {
  __typename?: string;
  balance: number;
  income: number;
  expenses: number;
}

interface DashboardSummaryFilters {
  period?: string;
}

interface DashboardSummaryResponse {
  getDashboardSummary: DashboardSummary;
}
