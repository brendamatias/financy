import { beforeEach, describe, expect, it } from "vitest";

import { prismaClient } from "../../prisma/prisma";
import { AuthService } from "./auth.service";
import { CategoryService } from "./category.service";
import { TransactionService } from "./transaction.service";

const authService = new AuthService();
const categoryService = new CategoryService();
const transactionService = new TransactionService();

let userId: string;
let otherUserId: string;
let foodId: string;
let transportId: string;

async function createTransaction(data: {
  description: string;
  amount: number;
  type: string;
  date: string;
  categoryId: string;
  userId: string;
}) {
  return prismaClient.transaction.create({
    data: { ...data, date: new Date(`${data.date}T00:00:00.000Z`) },
  });
}

beforeEach(async () => {
  const owner = await authService.register({
    name: "Conta Teste",
    email: "conta@teste.com",
    password: "12345678",
  });

  const other = await authService.register({
    name: "Outra Conta",
    email: "outra@teste.com",
    password: "12345678",
  });

  userId = owner.user.id;
  otherUserId = other.user.id;

  const food = await categoryService.createCategory(
    { name: "Alimentação", description: "", color: "blue", icon: "food" },
    userId,
  );

  const transport = await categoryService.createCategory(
    { name: "Transporte", description: "", color: "purple", icon: "car" },
    userId,
  );

  foodId = food.id;
  transportId = transport.id;

  await createTransaction({
    description: "Jantar no restaurante",
    amount: 89.5,
    type: "expense",
    date: "2025-11-30",
    categoryId: foodId,
    userId,
  });

  await createTransaction({
    description: "Uber para o trabalho",
    amount: 32.4,
    type: "expense",
    date: "2025-11-12",
    categoryId: transportId,
    userId,
  });

  await createTransaction({
    description: "Pagamento de salário",
    amount: 4250,
    type: "income",
    date: "2025-12-01",
    categoryId: foodId,
    userId,
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
      description: "Compras",
      amount: 100,
      type: "expense",
      date: "2025-11-20",
      categoryId: category.id,
      userId: otherUserId,
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
