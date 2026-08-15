import { describe, expect, it } from "vitest";

import {
  formatCompactCurrency,
  formatCompactSignedCurrency,
  formatCurrency,
  formatDate,
  formatPeriod,
  formatSignedCurrency,
  todayISO,
} from "@/lib/format";

function normalize(value: string) {
  return value.replace(/\u00a0/g, " ");
}

describe("formatCompactCurrency", () => {
  it("keeps values below a million untouched", () => {
    expect(normalize(formatCompactCurrency(999_499.99))).toBe("R$ 999.499,99");
  });

  it("shortens millions", () => {
    expect(normalize(formatCompactCurrency(3_213_123.64))).toBe("R$ 3,21 MM");
  });

  it("shortens billions", () => {
    expect(normalize(formatCompactCurrency(3_213_123_138.64))).toBe(
      "R$ 3,21 BI",
    );
  });

  it("shortens trillions", () => {
    expect(normalize(formatCompactCurrency(1_500_000_000_000))).toBe(
      "R$ 1,50 TRI",
    );
  });

  it("moves up a unit instead of rounding to a thousand", () => {
    expect(normalize(formatCompactCurrency(999_999_999.9))).toBe("R$ 1,00 BI");
  });

  it("keeps the minus sign", () => {
    expect(normalize(formatCompactCurrency(-4_500_000))).toBe("-R$ 4,50 MM");
  });

  it("formats zero", () => {
    expect(normalize(formatCompactCurrency(0))).toBe("R$ 0,00");
  });
});

describe("formatCompactSignedCurrency", () => {
  it("shortens big amounts keeping the sign", () => {
    expect(normalize(formatCompactSignedCurrency(-4_124_321_432.43))).toBe(
      "- R$ 4,12 BI",
    );
  });

  it("marks positive amounts with a plus", () => {
    expect(normalize(formatCompactSignedCurrency(3_123_132.13))).toBe(
      "+ R$ 3,12 MM",
    );
  });

  it("keeps small amounts untouched", () => {
    expect(normalize(formatCompactSignedCurrency(-89.5))).toBe("- R$ 89,50");
  });
});

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

  it("formats a full ISO datetime coming from the server", () => {
    expect(formatDate("2025-11-30T00:00:00.000Z")).toBe("30/11/25");
  });

  it("keeps the day regardless of the timezone", () => {
    expect(formatDate("2025-01-01")).toBe("01/01/25");
    expect(formatDate("2025-12-31")).toBe("31/12/25");
    expect(formatDate("2025-01-01T00:00:00.000Z")).toBe("01/01/25");
    expect(formatDate("2025-12-31T23:59:59.000Z")).toBe("31/12/25");
  });
});

describe("formatPeriod", () => {
  it("turns MM/YYYY into a readable period", () => {
    expect(formatPeriod("11/2025")).toBe("Novembro / 2025");
  });

  it("capitalizes the month name", () => {
    expect(formatPeriod("01/2026")).toBe("Janeiro / 2026");
    expect(formatPeriod("12/2025")).toBe("Dezembro / 2025");
  });

  it("keeps the year as sent", () => {
    expect(formatPeriod("03/1999")).toBe("Março / 1999");
  });
});

describe("todayISO", () => {
  it("returns today in the AAAA-MM-DD format", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("uses the local date, not UTC", () => {
    const today = new Date();
    const expected = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    expect(todayISO()).toBe(expected);
  });
});
