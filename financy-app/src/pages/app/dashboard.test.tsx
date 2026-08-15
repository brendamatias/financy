import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { Dashboard } from "@/pages/app/dashboard";
import { renderWithRouter } from "@/tests/render";

function renderPage() {
  return renderWithRouter(<Dashboard />, { path: "/dashboard" });
}

describe("Dashboard page", () => {
  it("renders the summary cards", async () => {
    renderPage();

    expect(await screen.findByText("Saldo total")).toBeVisible();
    expect(screen.getByText("Receitas do mês")).toBeVisible();
    expect(screen.getByText("Despesas do mês")).toBeVisible();
  });

  it("shows the balance coming from the api", async () => {
    const income = db.transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = db.transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = (income - expenses).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });

    renderPage();

    await waitFor(() => expect(document.body).toHaveTextContent(balance));
  });

  it("renders the most recent transactions", async () => {
    renderPage();

    expect(
      await screen.findByText(db.transactions[0].description),
    ).toBeVisible();
  });

  it("shows the empty state when there is no transaction", async () => {
    db.transactions = [];

    renderPage();

    expect(await screen.findByText("Nenhuma transação por aqui")).toBeVisible();
  });

  it("lists the categories on the side card", async () => {
    renderPage();

    expect(await screen.findByText("Categorias")).toBeVisible();

    await waitFor(() =>
      expect(screen.getAllByText(/itens|item/).length).toBeGreaterThan(0),
    );
  });
});
