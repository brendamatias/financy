import { render, screen } from "@testing-library/react";
import { Utensils } from "lucide-react";
import { describe, expect, it } from "vitest";

import { CategoryIcon } from "@/components/category-icon";

function getIcon() {
  return document.querySelector("[data-slot=category-icon]")!;
}

describe("CategoryIcon", () => {
  it("renders the given icon", () => {
    render(<CategoryIcon icon={Utensils} aria-label="Alimentação" />);

    expect(screen.getByLabelText("Alimentação")).toBeVisible();
  });

  it("paints with the color of the category", () => {
    render(<CategoryIcon icon={Utensils} color="blue" />);

    expect(getIcon()).toHaveClass("bg-blue-light", "text-blue-base");
  });

  it("falls back to green when no color is given", () => {
    render(<CategoryIcon icon={Utensils} />);

    expect(getIcon()).toHaveClass("bg-green-light", "text-green-base");
  });

  it("keeps the square size of the design system", () => {
    render(<CategoryIcon icon={Utensils} color="pink" />);

    expect(getIcon()).toHaveClass("size-10", "rounded-lg");
  });
});
