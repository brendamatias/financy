import { render, screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { describe, expect, it } from "vitest";

import { SummaryCard, SummaryCardSkeleton } from "@/components/summary-card";

describe("SummaryCard", () => {
  it("renders the label and the value", () => {
    render(
      <SummaryCard label="Saldo total" value="R$ 12.847,32" icon={Wallet} />,
    );

    expect(screen.getByText("Saldo total")).toBeVisible();
    expect(screen.getByText("R$ 12.847,32")).toBeVisible();
  });

  it("accepts a number as value", () => {
    render(<SummaryCard label="Total de categorias" value={8} icon={Wallet} />);

    expect(screen.getByText("8")).toBeVisible();
  });

  it("paints the icon with the given class", () => {
    const { container } = render(
      <SummaryCard
        label="Receitas"
        value="R$ 0,00"
        icon={Wallet}
        iconClassName="text-green-base"
      />,
    );

    expect(container.querySelector("svg")).toHaveClass("text-green-base");
  });
});

describe("SummaryCardSkeleton", () => {
  it("renders placeholders instead of content", () => {
    const { container } = render(<SummaryCardSkeleton />);

    expect(container.querySelectorAll("[data-slot=skeleton]").length).toBe(3);
    expect(container.querySelector("svg")).toBeNull();
  });
});
