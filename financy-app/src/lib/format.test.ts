import { describe, expect, it } from "vitest";

import { formatCurrency, formatDate, formatSignedCurrency } from "@/lib/format";

function normalize(value: string) {
  return value.replace(/\u00a0/g, " ");
}

describe("formatCurrency", () => {
  it("formats using the brazilian currency", () => {
    expect(normalize(formatCurrency(4250))).toBe("R$ 4.250,00");
  });

  it("always keeps two decimal places", () => {
    expect(normalize(formatCurrency(89.5))).toBe("R$ 89,50");
  });

  it("formats zero", () => {
    expect(normalize(formatCurrency(0))).toBe("R$ 0,00");
  });

  it("keeps the minus sign for negative values", () => {
    expect(normalize(formatCurrency(-100))).toBe("-R$ 100,00");
  });
});

describe("formatSignedCurrency", () => {
  it("adds a plus sign for income", () => {
    expect(normalize(formatSignedCurrency(340.25))).toBe("+ R$ 340,25");
  });

  it("adds a minus sign and drops the negative from the number", () => {
    expect(normalize(formatSignedCurrency(-89.5))).toBe("- R$ 89,50");
  });

  it("treats zero as positive", () => {
    expect(normalize(formatSignedCurrency(0))).toBe("+ R$ 0,00");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as dd/mm/yy", () => {
    expect(formatDate("2025-11-30")).toBe("30/11/25");
  });

  it("keeps the day regardless of the timezone", () => {
    expect(formatDate("2025-01-01")).toBe("01/01/25");
    expect(formatDate("2025-12-31")).toBe("31/12/25");
  });
});
