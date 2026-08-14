import { HttpResponse, delay, http } from "msw";

import { db } from "@/mocks/data";

export const dashboardHandlers = [
  http.get("/api/dashboard/summary", async () => {
    await delay(300);

    const income = db.transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = db.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    return HttpResponse.json({
      balance: income - expenses,
      income,
      expenses,
    } satisfies DashboardSummary);
  }),
];
