export function getInitials(name: string) {
  const [first = "", last = ""] = name.trim().split(/\s+/);

  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}
