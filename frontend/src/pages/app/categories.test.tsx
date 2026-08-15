import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { db } from "@/mocks/data";
import { Categories } from "@/pages/app/categories";
import { renderWithRouter } from "@/tests/render";

function renderPage() {
  return renderWithRouter(<Categories />, { path: "/categories" });
}

describe("Categories page", () => {
  it("renders the categories returned by the api", async () => {
    renderPage();

    expect(await screen.findByText(db.categories[0].description)).toBeVisible();

    expect(
      screen.getByRole("button", {
        name: `Editar categoria ${db.categories[0].name}`,
      }),
    ).toBeVisible();
  });

  it("shows how many categories the user has", async () => {
    renderPage();

    expect(await screen.findByText("Total de categorias")).toBeVisible();
    expect(screen.getByText(String(db.categories.length))).toBeVisible();
  });

  it("shows the transaction count that came from the api", async () => {
    db.categories[0].transactionsCount = 12;

    renderPage();

    expect(await screen.findByText("12 itens")).toBeVisible();
  });

  it("shows the empty state when there is no category", async () => {
    db.categories = [];

    renderPage();

    expect(await screen.findByText("Nenhuma categoria por aqui")).toBeVisible();
  });

  it("asks for confirmation before deleting", async () => {
    const target = db.categories[0];
    const { user } = renderPage();

    await user.click(
      await screen.findByRole("button", {
        name: `Excluir categoria ${target.name}`,
      }),
    );

    expect(await screen.findByText("Excluir categoria")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByText("Excluir categoria")).toBeNull(),
    );

    expect(screen.getByText(target.description)).toBeVisible();
  });

  it("deletes a category", async () => {
    const target = db.categories[0];
    const { user } = renderPage();

    const deleteButton = await screen.findByRole("button", {
      name: `Excluir categoria ${target.name}`,
    });

    await user.click(deleteButton);

    await user.click(await screen.findByRole("button", { name: /^Excluir$/ }));

    await waitFor(() =>
      expect(document.body).toHaveTextContent(
        "Categoria excluída com sucesso.",
      ),
    );

    await waitFor(() => expect(screen.queryByText(target.name)).toBeNull());
  });
});
