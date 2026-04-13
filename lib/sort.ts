export type SortOrder = "asc" | "desc";

export function sortByText<T>(field: keyof T, order: SortOrder = "asc") {
  return (a: T, b: T): number => {
    const result = String(a[field] ?? "").localeCompare(String(b[field] ?? ""));
    return order === "desc" ? -result : result;
  };
}

export function sortByNumber<T>(field: keyof T, order: SortOrder = "asc") {
  return (a: T, b: T): number => {
    const result = Number(a[field] ?? 0) - Number(b[field] ?? 0);
    return order === "desc" ? -result : result;
  };
}

export function sortByDate<T>(field: keyof T, order: SortOrder = "asc") {
  return (a: T, b: T): number => {
    const result = new Date(String(a[field] ?? "")).getTime() - new Date(String(b[field] ?? "")).getTime();

    return order === "desc" ? -result : result;
  };
}
