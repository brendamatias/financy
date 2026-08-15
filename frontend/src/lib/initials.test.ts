import { describe, expect, it } from "vitest";

import { getInitials } from "@/lib/initials";

describe("getInitials", () => {
  it("takes the first letter of the first and last name", () => {
    expect(getInitials("Conta Teste")).toBe("CT");
  });

  it("ignores the middle names", () => {
    expect(getInitials("Maria da Silva")).toBe("MS");
  });

  it("returns a single letter for a single name", () => {
    expect(getInitials("Brenda")).toBe("B");
  });

  it("ignores extra spaces", () => {
    expect(getInitials("  ana   paula  ")).toBe("AP");
  });

  it("returns an empty string for an empty name", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });

  it("always returns uppercase", () => {
    expect(getInitials("joão pereira")).toBe("JP");
  });
});
