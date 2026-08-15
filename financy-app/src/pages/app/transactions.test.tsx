import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { Transactions } from "@/pages/app/transactions";
import { renderWithRouter } from "@/tests/render";

function renderPage() {
  return renderWithRouter(<Transactions />, { path: "/transactions" });
}

describe("Transactions page", () => {
  it("renders the transactions returned by the api", async () => {
    renderPage();

    expect(
      await screen.findByText(db.transactions[0].description),
    ).toBeVisible();
  });

  it("shows how many results were found", async () => {
    renderPage();

    await waitFor(() =>
      expect(document.body).toHaveTextContent(`${db.transactions.length}`),
    );
  });

  it("shows the empty message when nothing matches the filters", async () => {
    db.transactions = [];

    renderPage();

    expect(
      await screen.findByText("Nenhuma transação encontrada."),
    ).toBeVisible();
  });

  it("filters by description", async () => {
    const { user } = renderPage();

    const search = await screen.findByLabelText("Buscar");

    await user.type(search, "Aluguel");

    expect(await screen.findByText("Aluguel")).toBeVisible();
    expect(screen.queryByText("Jantar no Restaurante")).toBeNull();
  });

  it("deletes a transaction", async () => {
    const target = db.transactions[0];
    const { user } = renderPage();

    const deleteButton = await screen.findByRole("button", {
      name: `Excluir ${target.description}`,
    });

    await user.click(deleteButton);

    await user.click(
      await screen.findByRole("button", { name: /^Excluir$/ }),
    );

    await waitFor(() =>
      expect(document.body).toHaveTextContent(
        "Transação excluída com sucesso.",
      ),
    );
  });

  it("paginates when there are more results than the page size", async () => {
    renderPage();

    const next = await screen.findByRole("button", { name: "Próxima página" });

    await waitFor(() => expect(next).toBeEnabled());

    expect(
      screen.getByRole("button", { name: "Página anterior" }),
    ).toBeDisabled();
  });
});
