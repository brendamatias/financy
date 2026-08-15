import { beforeEach, describe, expect, it } from "vitest";

import { prismaClient } from "../../prisma/prisma";
import {
  createCategory,
  createTransaction,
  createUser,
} from "../tests/factories";
import { CategoryService } from "./category.service";
import { TransactionService } from "./transaction.service";

const categoryService = new CategoryService();
const transactionService = new TransactionService();

let userId: string;
let otherUserId: string;
let foodId: string;
let transportId: string;

beforeEach(async () => {
  const owner = await createUser();
  const other = await createUser({
    name: "Outra Conta",
    email: "outra@teste.com",
  });

  userId = owner.id;
  otherUserId = other.id;

  const food = await createCategory(userId);
  const transport = await createCategory(userId, {
    name: "Transporte",
    color: "purple",
    icon: "car",
  });

  foodId = food.id;
  transportId = transport.id;

  await createTransaction({
      userId,
      categoryId: foodId,
      description: "Jantar no restaurante",
      amount: 89.5,
      type: "expense",
      date: "2025-11-30",
    });

  await createTransaction({
      userId,
      categoryId: transportId,
      description: "Uber para o trabalho",
      amount: 32.4,
      type: "expense",
      date: "2025-11-12",
    });

  await createTransaction({
      userId,
      categoryId: foodId,
      description: "Pagamento de salário",
      amount: 4250,
      type: "income",
      date: "2025-12-01",
    });
});

describe("TransactionService.listTransactions", () => {
  it("returns the transactions of the given user", async () => {
    const result = await transactionService.listTransactions({}, userId);

    expect(result.data).toHaveLength(3);
    expect(result.meta.total).toBe(3);
  });

  it("does not return transactions from another user", async () => {
    const category = await categoryService.createCategory(
      { name: "Mercado", description: "", color: "orange", icon: "market" },
      otherUserId,
    );

    await createTransaction({
      userId: otherUserId,
      categoryId: category.id,
      description: "Compras",
      amount: 100,
      type: "expense",
      date: "2025-11-20",
    });

    const result = await transactionService.listTransactions({}, userId);

    expect(result.meta.total).toBe(3);
  });

  it("sorts by date, most recent first", async () => {
    const result = await transactionService.listTransactions({}, userId);

    expect(result.data.map((item) => item.description)).toEqual([
      "Pagamento de salário",
      "Jantar no restaurante",
      "Uber para o trabalho",
    ]);
  });

  it("includes the category of each transaction", async () => {
    const result = await transactionService.listTransactions({}, userId);

    expect(result.data[0].category.name).toBe("Alimentação");
  });

  it("filters by description", async () => {
    const result = await transactionService.listTransactions(
      { searchQuery: "uber" },
      userId,
    );

    expect(result.meta.total).toBe(1);
    expect(result.data[0].description).toBe("Uber para o trabalho");
  });

  it("filters by type", async () => {
    const result = await transactionService.listTransactions(
      { type: "income" },
      userId,
    );

    expect(result.meta.total).toBe(1);
    expect(result.data[0].type).toBe("income");
  });

  it("filters by category", async () => {
    const result = await transactionService.listTransactions(
      { categoryId: transportId },
      userId,
    );

    expect(result.meta.total).toBe(1);
    expect(result.data[0].categoryId).toBe(transportId);
  });

  it("filters by period", async () => {
    const result = await transactionService.listTransactions(
      { period: "11/2025" },
      userId,
    );

    expect(result.meta.total).toBe(2);
  });

  it("combines filters", async () => {
    const result = await transactionService.listTransactions(
      { period: "11/2025", type: "expense", categoryId: foodId },
      userId,
    );

    expect(result.meta.total).toBe(1);
    expect(result.data[0].description).toBe("Jantar no restaurante");
  });

  it("paginates the result", async () => {
    const firstPage = await transactionService.listTransactions(
      { pageSize: 2 },
      userId,
    );

    expect(firstPage.data).toHaveLength(2);
    expect(firstPage.meta).toMatchObject({
      page: 1,
      pageSize: 2,
      total: 3,
      totalPages: 2,
    });

    const secondPage = await transactionService.listTransactions(
      { page: 2, pageSize: 2 },
      userId,
    );

    expect(secondPage.data).toHaveLength(1);
    expect(secondPage.meta.page).toBe(2);
  });

  it("returns an empty list when nothing matches", async () => {
    const result = await transactionService.listTransactions(
      { searchQuery: "não existe" },
      userId,
    );

    expect(result.data).toHaveLength(0);
    expect(result.meta).toMatchObject({ total: 0, totalPages: 1 });
  });

  it("rejects a period outside the MM/YYYY format", async () => {
    await expect(
      transactionService.listTransactions(
        { period: "Novembro / 2025" },
        userId,
      ),
    ).rejects.toThrow("Informe o período no formato MM/AAAA");
  });

  it("rejects an invalid type", async () => {
    await expect(
      transactionService.listTransactions({ type: "outro" }, userId),
    ).rejects.toThrow();
  });
});

describe("TransactionService.listPeriods", () => {
  it("returns the distinct periods, most recent first", async () => {
    const periods = await transactionService.listPeriods(userId);

    expect(periods).toEqual(["12/2025", "11/2025"]);
  });

  it("returns an empty list for a user without transactions", async () => {
    const periods = await transactionService.listPeriods(otherUserId);

    expect(periods).toEqual([]);
  });
});

function toLocalISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

describe("TransactionService.createTransaction", () => {
  const base = {
    description: "Almoço",
    amount: 42.5,
    type: "expense",
    categoryId: "",
  };

  it("creates a transaction with today's date", async () => {
    const today = toLocalISODate(new Date());

    const transaction = await transactionService.createTransaction(
      { ...base, categoryId: foodId, date: today },
      userId,
    );

    expect(transaction.description).toBe("Almoço");
    expect(transaction.userId).toBe(userId);
  });

  it("rejects a date in the future", async () => {
    const tomorrow = toLocalISODate(new Date(Date.now() + 24 * 60 * 60 * 1000));

    await expect(
      transactionService.createTransaction(
        { ...base, categoryId: foodId, date: tomorrow },
        userId,
      ),
    ).rejects.toThrow("A data não pode ser no futuro");
  });

  it("accepts a date in the past", async () => {
    const transaction = await transactionService.createTransaction(
      { ...base, categoryId: foodId, date: "2020-01-15" },
      userId,
    );

    expect(transaction.date.toISOString()).toBe("2020-01-15T00:00:00.000Z");
  });

  it("rejects a category from another user", async () => {
    const category = await categoryService.createCategory(
      { name: "Outra", description: "", color: "red", icon: "health" },
      otherUserId,
    );

    await expect(
      transactionService.createTransaction(
        { ...base, categoryId: category.id, date: "2025-11-10" },
        userId,
      ),
    ).rejects.toThrow("Categoria não encontrada!");
  });

  it("rejects an amount of zero or less", async () => {
    await expect(
      transactionService.createTransaction(
        { ...base, amount: 0, categoryId: foodId, date: "2025-11-10" },
        userId,
      ),
    ).rejects.toThrow("O valor deve ser maior que zero");
  });
});

describe("TransactionService.updateTransaction", () => {
  it("rejects a date in the future", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    const tomorrow = toLocalISODate(new Date(Date.now() + 24 * 60 * 60 * 1000));

    await expect(
      transactionService.updateTransaction(
        transaction.id,
        { date: tomorrow },
        userId,
      ),
    ).rejects.toThrow("A data não pode ser no futuro");
  });
});

describe("TransactionService.updateTransaction", () => {
  it("updates the fields of the transaction", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    const updated = await transactionService.updateTransaction(
      transaction.id,
      { description: "Salário atualizado", amount: 5000 },
      userId,
    );

    expect(updated.description).toBe("Salário atualizado");
    expect(updated.amount).toBe(5000);
    expect(updated.type).toBe(transaction.type);
  });

  it("moves the transaction to another category", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    const updated = await transactionService.updateTransaction(
      transaction.id,
      { categoryId: transportId },
      userId,
    );

    expect(updated.categoryId).toBe(transportId);
  });

  it("rejects a category from another user", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    const category = await categoryService.createCategory(
      { name: "Outra", description: "", color: "red", icon: "health" },
      otherUserId,
    );

    await expect(
      transactionService.updateTransaction(
        transaction.id,
        { categoryId: category.id },
        userId,
      ),
    ).rejects.toThrow("Categoria não encontrada!");
  });

  it("requires the transaction id", async () => {
    await expect(
      transactionService.updateTransaction("", { amount: 10 }, userId),
    ).rejects.toThrow("Informe o id da transação");
  });

  it("rejects a transaction from another user", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    await expect(
      transactionService.updateTransaction(
        transaction.id,
        { amount: 10 },
        otherUserId,
      ),
    ).rejects.toThrow("Transação não encontrada!");
  });
});

describe("TransactionService.deleteTransaction", () => {
  it("deletes the transaction", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    await expect(
      transactionService.deleteTransaction(transaction.id, userId),
    ).resolves.toBe(true);

    const result = await transactionService.listTransactions({}, userId);

    expect(result.meta.total).toBe(2);
  });

  it("requires the transaction id", async () => {
    await expect(
      transactionService.deleteTransaction("", userId),
    ).rejects.toThrow("Informe o id da transação");
  });

  it("rejects a transaction from another user", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    await expect(
      transactionService.deleteTransaction(transaction.id, otherUserId),
    ).rejects.toThrow("Transação não encontrada!");

    expect(await prismaClient.transaction.count()).toBe(3);
  });
});

describe("TransactionService.findTransaction", () => {
  it("returns the transaction with its category", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    const result = await transactionService.findTransaction(
      transaction.id,
      userId,
    );

    expect(result.id).toBe(transaction.id);
    expect(result.category.name).toBeTruthy();
  });

  it("rejects a transaction from another user", async () => {
    const [transaction] = (
      await transactionService.listTransactions({}, userId)
    ).data;

    await expect(
      transactionService.findTransaction(transaction.id, otherUserId),
    ).rejects.toThrow("Transação não encontrada!");
  });
});
