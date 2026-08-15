import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CategoryCard, CategoryCardSkeleton } from "@/components/category-card";
import { db } from "@/mocks/data";
import { renderWithRouter } from "@/tests/render";

const category = () => db.categories[0];

describe("CategoryCard", () => {
  it("renders the name and the description", () => {
    renderWithRouter(<CategoryCard category={category()} />);

    expect(screen.getByText(category().description)).toBeVisible();
    expect(screen.getAllByText(category().name).length).toBeGreaterThan(0);
  });

  it("shows the transaction count in the plural", () => {
    renderWithRouter(
      <CategoryCard category={{ ...category(), transactionsCount: 12 }} />,
    );

    expect(screen.getByText("12 itens")).toBeVisible();
  });

  it("shows the transaction count in the singular", () => {
    renderWithRouter(
      <CategoryCard category={{ ...category(), transactionsCount: 1 }} />,
    );

    expect(screen.getByText("1 item")).toBeVisible();
  });

  it("shows zero when the count did not come from the api", () => {
    renderWithRouter(
      <CategoryCard
        category={{ ...category(), transactionsCount: undefined }}
      />,
    );

    expect(screen.getByText("0 itens")).toBeVisible();
  });

  it("asks for confirmation before calling onDelete", async () => {
    const onDelete = vi.fn();
    const { user } = renderWithRouter(
      <CategoryCard category={category()} onDelete={onDelete} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `Excluir categoria ${category().name}`,
      }),
    );

    expect(onDelete).not.toHaveBeenCalled();

    await user.click(await screen.findByRole("button", { name: /^Excluir$/ }));

    expect(onDelete).toHaveBeenCalledWith(category().id);
  });

  it("opens the edit dialog", async () => {
    const { user } = renderWithRouter(<CategoryCard category={category()} />);

    await user.click(
      screen.getByRole("button", {
        name: `Editar categoria ${category().name}`,
      }),
    );

    expect(await screen.findByText("Editar categoria")).toBeVisible();
  });
});

describe("CategoryCardSkeleton", () => {
  it("renders placeholders instead of content", () => {
    const { container } = renderWithRouter(<CategoryCardSkeleton />);

    expect(
      container.querySelectorAll("[data-slot=skeleton]").length,
    ).toBeGreaterThan(0);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
