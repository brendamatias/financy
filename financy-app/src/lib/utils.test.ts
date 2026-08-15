import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins the class names", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("keeps the last one when tailwind classes conflict", () => {
    expect(cn("p-2", "p-6")).toBe("p-6");
    expect(cn("text-gray-500", "text-danger")).toBe("text-danger");
  });

  it("lets size override width and height", () => {
    expect(cn("h-8 w-8", "size-6")).toBe("size-6");
  });

  it("ignores falsy values", () => {
    expect(cn("flex", false, undefined, null, "gap-2")).toBe("flex gap-2");
  });

  it("applies conditional classes", () => {
    const isActive = true;

    expect(cn("border", isActive && "border-brand-base")).toBe(
      "border border-brand-base",
    );
  });
});
