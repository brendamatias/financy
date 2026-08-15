import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  TransactionRow,
  TransactionRowSkeleton,
} from "@/components/transaction-row";
import { Table, TableBody } from "@/components/ui/table";
import { db } from "@/mocks/data";
import { renderWithRouter } from "@/tests/render";

const expense = () => db.transactions.find((item) => item.type === "expense")!;
const income = () => db.transactions.find((item) => item.type === "income")!;

function renderRow(children: React.ReactNode) {
  return renderWithRouter(
    <Table>
      <TableBody>{children}</TableBody>
    </Table>,
  );
}

describe("TransactionRow", () => {
  it("renders the description, the date and the category", () => {
    const transaction = expense();

    renderRow(<TransactionRow transaction={transaction} />);

    expect(screen.getByText(transaction.description)).toBeVisible();
    expect(screen.getByText("30/11/25")).toBeVisible();
    expect(screen.getByText(transaction.category.name)).toBeVisible();
  });

  it("shows an expense with a minus sign", () => {
    renderRow(<TransactionRow transaction={expense()} />);

    expect(screen.getByText(/^-\s/)).toBeVisible();
    expect(screen.getByText("Saída")).toBeVisible();
  });

  it("shows an income with a plus sign", () => {
    renderRow(<TransactionRow transaction={income()} />);

    expect(screen.getByText(/^\+\s/)).toBeVisible();
    expect(screen.getByText("Entrada")).toBeVisible();
  });

  it("asks for confirmation before calling onDelete", async () => {
    const transaction = expense();
    const onDelete = vi.fn();

    const { user } = renderRow(
      <TransactionRow transaction={transaction} onDelete={onDelete} />,
    );

    await user.click(
      screen.getByRole("button", {
        name: `Excluir ${transaction.description}`,
      }),
    );

    expect(onDelete).not.toHaveBeenCalled();

    await user.click(await screen.findByRole("button", { name: /^Excluir$/ }));

    expect(onDelete).toHaveBeenCalledWith(transaction.id);
  });

  it("opens the edit dialog", async () => {
    const transaction = expense();

    const { user } = renderRow(<TransactionRow transaction={transaction} />);

    await user.click(
      screen.getByRole("button", {
        name: `Editar ${transaction.description}`,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: "Editar transação" }),
    ).toBeVisible();
  });

  it("disables the delete button while deleting", async () => {
    const transaction = expense();

    renderRow(<TransactionRow transaction={transaction} isDeleting />);

    expect(
      screen.getByRole("button", {
        name: `Excluir ${transaction.description}`,
      }),
    ).toBeVisible();
  });
});

describe("TransactionRowSkeleton", () => {
  it("renders placeholders instead of content", () => {
    const { container } = renderRow(<TransactionRowSkeleton />);

    expect(
      container.querySelectorAll("[data-slot=skeleton]").length,
    ).toBeGreaterThan(0);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
