const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

const compactUnits = [
  { threshold: 1e12, suffix: "TRI" },
  { threshold: 1e9, suffix: "BI" },
  { threshold: 1e6, suffix: "MM" },
];

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatCompactCurrency(value: number) {
  const absolute = Math.abs(value);
  const unit = compactUnits.find(
    ({ threshold }) => absolute >= threshold * 0.9995,
  );

  if (!unit) {
    return currencyFormatter.format(value);
  }

  return `${currencyFormatter.format(value / unit.threshold)} ${unit.suffix}`;
}

function formatSignedCurrency(value: number) {
  const sign = value < 0 ? "-" : "+";

  return `${sign} ${currencyFormatter.format(Math.abs(value))}`;
}

function formatCompactSignedCurrency(value: number) {
  const sign = value < 0 ? "-" : "+";

  return `${sign} ${formatCompactCurrency(Math.abs(value))}`;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("T")[0].split("-").map(Number);

  return dateFormatter.format(new Date(year, month - 1, day));
}

function todayISO() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
}

function formatPeriod(period: string) {
  const [month, year] = period.split("/").map(Number);

  const label = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    new Date(year, month - 1, 1),
  );

  return `${label[0].toUpperCase()}${label.slice(1)} / ${year}`;
}

export {
  formatCompactCurrency,
  formatCompactSignedCurrency,
  formatCurrency,
  formatDate,
  formatPeriod,
  formatSignedCurrency,
  todayISO,
};
