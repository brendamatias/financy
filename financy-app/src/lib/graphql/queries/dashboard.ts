import { gql, type TypedDocumentNode } from "@apollo/client";

export const GET_DASHBOARD_SUMMARY: TypedDocumentNode<
  DashboardSummaryResponse,
  { data?: DashboardSummaryFilters }
> = gql`
  query GetDashboardSummary($data: DashboardSummaryInput) {
    getDashboardSummary(data: $data) {
      balance
      income
      expenses
    }
  }
`;
