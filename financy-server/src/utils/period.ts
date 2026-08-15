export function periodToRange(period: string) {
  const [month, year] = period.split("/").map(Number);

  return {
    gte: new Date(Date.UTC(year, month - 1, 1)),
    lt: new Date(Date.UTC(year, month, 1)),
  };
}

export function toPeriod(date: Date, reference: "utc" | "local" = "utc") {
  const month =
    reference === "utc" ? date.getUTCMonth() + 1 : date.getMonth() + 1;
  const year = reference === "utc" ? date.getUTCFullYear() : date.getFullYear();

  return `${String(month).padStart(2, "0")}/${year}`;
}

export function currentPeriod(reference = new Date()) {
  return toPeriod(reference, "local");
}
