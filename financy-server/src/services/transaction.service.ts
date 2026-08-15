import { prismaClient } from "../../prisma/prisma";
import { ListTransactionsInput } from "../dtos/input/transaction.input";
import { listTransactionsSchema } from "../schemas/transaction.schema";
import { validate } from "../utils/validate";

function periodToRange(period: string) {
  const [month, year] = period.split("/").map(Number);

  return {
    gte: new Date(Date.UTC(year, month - 1, 1)),
    lt: new Date(Date.UTC(year, month, 1)),
  };
}

export class TransactionService {
  async listTransactions(input: ListTransactionsInput, userId: string) {
    const { searchQuery, type, categoryId, period, page, pageSize } = validate(
      listTransactionsSchema,
      input,
    );

    const where = {
      userId,
      ...(searchQuery ? { description: { contains: searchQuery } } : {}),
      ...(type !== "all" ? { type } : {}),
      ...(categoryId !== "all" ? { categoryId } : {}),
      ...(period ? { date: periodToRange(period) } : {}),
    };

    const [data, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prismaClient.transaction.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    };
  }

  async listPeriods(userId: string) {
    const rows = await prismaClient.$queryRaw<{ period: string }[]>`
      SELECT strftime('%m/%Y', date) AS period
      FROM "Transaction"
      WHERE "userId" = ${userId}
      GROUP BY period
      ORDER BY MAX(date) DESC
    `;

    return rows.map((row) => row.period);
  }
}
