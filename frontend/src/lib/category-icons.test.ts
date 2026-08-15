import { Utensils } from "lucide-react";
import { describe, expect, it } from "vitest";

import { categoryIcons, getCategoryIcon } from "@/lib/category-icons";

describe("getCategoryIcon", () => {
  it("returns the icon of the given name", () => {
    expect(getCategoryIcon("food")).toBe(Utensils);
  });

  it("returns an icon for every name in the map", () => {
    const names = Object.keys(categoryIcons) as CategoryIconName[];

    names.forEach((name) => {
      expect(getCategoryIcon(name)).toBeTypeOf("object");
    });
  });

  it("falls back to a default icon for an unknown name", () => {
    const icon = getCategoryIcon("nao-existe" as CategoryIconName);

    expect(icon).toBeDefined();
  });
});

describe("categoryIcons", () => {
  it("covers the 17 icons offered in the category form", () => {
    expect(Object.keys(categoryIcons)).toHaveLength(17);
  });
});
