import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TitleSection } from "@/components/title-section";

describe("TitleSection", () => {
  it("renders the given text", () => {
    render(<TitleSection text="Transações recentes" />);

    expect(screen.getByText("Transações recentes")).toBeVisible();
  });

  it("uses the small uppercase style of the design system", () => {
    render(<TitleSection text="Categorias" />);

    const title = screen.getByText("Categorias");

    expect(title).toHaveClass("text-xs", "uppercase", "text-gray-500");
  });

  it("accepts extra classes without losing the default ones", () => {
    render(<TitleSection text="Saldo" className="text-gray-800" />);

    const title = screen.getByText("Saldo");

    expect(title).toHaveClass("text-gray-800", "uppercase");
    expect(title).not.toHaveClass("text-gray-500");
  });
});
