import { prismaClient } from "../../prisma/prisma";
import { DashboardSummaryInput } from "../dtos/input/dashboard.input";
import { dashboardSummarySchema } from "../schemas/dashboard.schema";
import { currentPeriod, periodToRange } from "../utils/period";
import { validate } from "../utils/validate";

export class DashboardService {
  async getSummary(input: DashboardSummaryInput, userId: string) {
    const { period } = validate(dashboardSummarySchema, input);

    const date = periodToRange(period ?? currentPeriod());

    const [income, expenses, periodIncome, periodExpenses] = await Promise.all([
      prismaClient.transaction.aggregate({
        where: { userId, type: "income" },
        _sum: { amount: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: "expense" },
        _sum: { amount: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: "income", date },
        _sum: { amount: true },
      }),
      prismaClient.transaction.aggregate({
        where: { userId, type: "expense", date },
        _sum: { amount: true },
      }),
    ]);

    return {
      balance: (income._sum.amount ?? 0) - (expenses._sum.amount ?? 0),
      income: periodIncome._sum.amount ?? 0,
      expenses: periodExpenses._sum.amount ?? 0,
    };
  }
}
