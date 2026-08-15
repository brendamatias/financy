export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  const first = parts.at(0) ?? "";
  const last = parts.length > 1 ? (parts.at(-1) ?? "") : "";

  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}
