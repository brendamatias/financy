import { prismaClient } from "../../prisma/prisma";
import {
  CreateTransactionInput,
  ListTransactionsInput,
  UpdateTransactionInput,
} from "../dtos/input/transaction.input";
import {
  createTransactionSchema,
  listTransactionsSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema";
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

  async findTransaction(id: string, userId: string) {
    const transactionId = validate(transactionIdSchema, id);

    const transaction = await prismaClient.transaction.findFirst({
      where: { id: transactionId, userId },
      include: { category: true },
    });

    if (!transaction) {
      throw new Error("Transação não encontrada!");
    }

    return transaction;
  }

  async createTransaction(input: CreateTransactionInput, userId: string) {
    const data = validate(createTransactionSchema, input);

    await this.ensureCategory(data.categoryId, userId);

    return prismaClient.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type,
        date: new Date(`${data.date}T00:00:00.000Z`),
        categoryId: data.categoryId,
        userId,
      },
      include: { category: true },
    });
  }

  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
    userId: string,
  ) {
    const transactionId = validate(transactionIdSchema, id);
    const data = validate(updateTransactionSchema, input);

    await this.findTransaction(transactionId, userId);

    if (data.categoryId) {
      await this.ensureCategory(data.categoryId, userId);
    }

    return prismaClient.transaction.update({
      where: { id: transactionId },
      data: {
        ...data,
        ...(data.date ? { date: new Date(`${data.date}T00:00:00.000Z`) } : {}),
      },
      include: { category: true },
    });
  }

  async deleteTransaction(id: string, userId: string) {
    const transactionId = validate(transactionIdSchema, id);

    await this.findTransaction(transactionId, userId);

    await prismaClient.transaction.delete({ where: { id: transactionId } });

    return true;
  }

  private async ensureCategory(categoryId: string, userId: string) {
    const category = await prismaClient.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    return category;
  }
}
