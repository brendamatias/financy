import { HttpResponse, delay, graphql } from "msw";

import { db } from "@/mocks/data";
import { toPeriod } from "@/mocks/utils";

const api = graphql.link(import.meta.env.VITE_GRAPHQL_URL);

function sum(type: TransactionType, period?: string) {
  return db.transactions
    .filter((transaction) => transaction.type === type)
    .filter((transaction) => !period || toPeriod(transaction.date) === period)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export const dashboardHandlers = [
  api.query<DashboardSummaryResponse, { data?: DashboardSummaryFilters }>(
    "GetDashboardSummary",
    async ({ variables }) => {
      await delay(300);

      const period = variables.data?.period;

      return HttpResponse.json({
        data: {
          getDashboardSummary: {
            __typename: "DashboardSummaryModel",
            balance: sum("income") - sum("expense"),
            income: sum("income", period),
            expenses: sum("expense", period),
          },
        },
      });
    },
  ),
];
