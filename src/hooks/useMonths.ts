// src/hooks/useMonths.ts
export function getLast12Months(): string[] {
  const formatter = new Intl.DateTimeFormat("ru", { month: "long", year: "numeric" });
  const months: string[] = [];

  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(formatter.format(d));
  }

  return months;
}
