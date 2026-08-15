import { beforeEach, describe, expect, it } from "vitest";

import {
  createCategory,
  createTransaction,
  createUser,
} from "../tests/factories";
import { currentPeriod } from "../utils/period";
import { DashboardService } from "./dashboard.service";

const dashboardService = new DashboardService();

let userId: string;
let otherUserId: string;
let categoryId: string;

function firstDayOfCurrentMonth() {
  const today = new Date();

  return new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
}

beforeEach(async () => {
  const owner = await createUser();
  const other = await createUser({
    name: "Outra Conta",
    email: "outra@teste.com",
  });

  userId = owner.id;
  otherUserId = other.id;

  const category = await createCategory(userId);

  categoryId = category.id;
});

describe("DashboardService.getSummary", () => {
  it("returns zeros for a user without transactions", async () => {
    const summary = await dashboardService.getSummary({}, userId);

    expect(summary).toEqual({ balance: 0, income: 0, expenses: 0 });
  });

  it("uses the current month when no period is given", async () => {
    await createTransaction({
      userId,
      categoryId,
      amount: 1000,
      type: "income",
      date: firstDayOfCurrentMonth(),
    });

    const summary = await dashboardService.getSummary({}, userId);

    expect(summary.income).toBe(1000);
  });

  it("returns the income and the expenses of the requested period", async () => {
    await createTransaction({
      userId,
      categoryId,
      amount: 4250,
      type: "income",
      date: new Date("2025-11-10T00:00:00.000Z"),
    });

    await createTransaction({
      userId,
      categoryId,
      amount: 250,
      type: "expense",
      date: new Date("2025-11-20T00:00:00.000Z"),
    });

    const summary = await dashboardService.getSummary(
      { period: "11/2025" },
      userId,
    );

    expect(summary.income).toBe(4250);
    expect(summary.expenses).toBe(250);
  });

  it("ignores transactions outside the requested period", async () => {
    await createTransaction({
      userId,
      categoryId,
      amount: 100,
      type: "income",
      date: new Date("2025-11-10T00:00:00.000Z"),
    });

    await createTransaction({
      userId,
      categoryId,
      amount: 900,
      type: "income",
      date: new Date("2025-12-10T00:00:00.000Z"),
    });

    const summary = await dashboardService.getSummary(
      { period: "11/2025" },
      userId,
    );

    expect(summary.income).toBe(100);
  });

  it("keeps the balance across every period", async () => {
    await createTransaction({
      userId,
      categoryId,
      amount: 1000,
      type: "income",
      date: new Date("2025-10-05T00:00:00.000Z"),
    });

    await createTransaction({
      userId,
      categoryId,
      amount: 400,
      type: "expense",
      date: new Date("2025-11-05T00:00:00.000Z"),
    });

    const summary = await dashboardService.getSummary(
      { period: "11/2025" },
      userId,
    );

    expect(summary.balance).toBe(600);
    expect(summary.income).toBe(0);
    expect(summary.expenses).toBe(400);
  });

  it("does not mix transactions from another user", async () => {
    await createTransaction({
      userId: otherUserId,
      categoryId,
      amount: 5000,
      type: "income",
      date: new Date("2025-11-10T00:00:00.000Z"),
    });

    const summary = await dashboardService.getSummary(
      { period: "11/2025" },
      userId,
    );

    expect(summary).toEqual({ balance: 0, income: 0, expenses: 0 });
  });

  it("rejects a period outside the MM/YYYY format", async () => {
    await expect(
      dashboardService.getSummary({ period: "Novembro / 2025" }, userId),
    ).rejects.toThrow("Informe o período no formato MM/AAAA");
  });

  it("accepts the current period explicitly", async () => {
    await createTransaction({
      userId,
      categoryId,
      amount: 300,
      type: "expense",
      date: firstDayOfCurrentMonth(),
    });

    const summary = await dashboardService.getSummary(
      { period: currentPeriod() },
      userId,
    );

    expect(summary.expenses).toBe(300);
  });
});
