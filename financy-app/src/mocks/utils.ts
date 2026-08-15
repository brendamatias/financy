export function toPeriod(date: string) {
  const [year, month] = date.split("T")[0].split("-");

  return `${month}/${year}`;
}
