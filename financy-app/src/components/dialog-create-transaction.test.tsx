import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DialogCreateTransaction } from "@/components/dialog-create-transaction";
import { Button } from "@/components/ui/button";
import { todayISO } from "@/lib/format";
import { db } from "@/mocks/data";
import { renderWithRouter } from "@/tests/render";

async function openDialog() {
  const { user } = renderWithRouter(
    <DialogCreateTransaction>
      <Button>Abrir</Button>
    </DialogCreateTransaction>,
  );

  await user.click(screen.getByRole("button", { name: "Abrir" }));

  return { user };
}

function tomorrowISO() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

describe("DialogCreateTransaction", () => {
  it("requires description, date, amount and category", async () => {
    const { user } = await openDialog();

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("Informe a descrição")).toBeVisible();
    expect(screen.getByText("Informe a data")).toBeVisible();
    expect(screen.getByText("Informe o valor")).toBeVisible();
    expect(screen.getByText("Selecione uma categoria")).toBeVisible();
  });

  it("rejects a date in the future", async () => {
    const { user } = await openDialog();

    await user.type(screen.getByLabelText("Descrição"), "Compra futura");
    await user.type(screen.getByLabelText("Data"), tomorrowISO());
    await user.type(screen.getByLabelText("Valor"), "1000");
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(
      await screen.findByText("A data não pode ser no futuro"),
    ).toBeVisible();
  });

  it("does not let the date input go past today", async () => {
    await openDialog();

    expect(screen.getByLabelText("Data")).toHaveAttribute("max", todayISO());
  });

  it("formats the amount as currency while typing", async () => {
    const { user } = await openDialog();

    const amount = screen.getByLabelText("Valor");

    await user.type(amount, "12345");

    expect(amount).toHaveValue("123,45");
  });

  it("starts as an expense and lets the user switch to income", async () => {
    const { user } = await openDialog();

    const expense = screen.getByRole("button", { name: "Despesa" });
    const income = screen.getByRole("button", { name: "Receita" });

    expect(expense).toHaveAttribute("aria-pressed", "true");

    await user.click(income);

    expect(income).toHaveAttribute("aria-pressed", "true");
    expect(expense).toHaveAttribute("aria-pressed", "false");
  });

  it("creates the transaction and closes the dialog", async () => {
    const total = db.transactions.length;
    const { user } = await openDialog();

    await user.type(screen.getByLabelText("Descrição"), "Café da manhã");
    await user.type(screen.getByLabelText("Data"), todayISO());
    await user.type(screen.getByLabelText("Valor"), "1550");

    await user.click(screen.getByLabelText("Categoria"));
    await user.click(
      await screen.findByRole("option", { name: "Alimentação" }),
    );

    await user.click(screen.getByRole("button", { name: "Salvar" }));

    await waitFor(() =>
      expect(document.body).toHaveTextContent("Transação criada com sucesso."),
    );

    expect(db.transactions).toHaveLength(total + 1);
    expect(db.transactions[0].description).toBe("Café da manhã");
  });
});
