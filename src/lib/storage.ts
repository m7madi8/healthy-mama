const SALES_KEY = "adminSales";

export type SaleRecord = {
  id: string;
  bookId: string;
  amount: number;
  date: string;
  note: string;
};

export function getSales(): SaleRecord[] {
  try {
    const raw = localStorage.getItem(SALES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SaleRecord[]) : [];
  } catch {
    return [];
  }
}

export function setSales(list: SaleRecord[]): void {
  localStorage.setItem(SALES_KEY, JSON.stringify(list));
}

export function addSale(bookId: string, amount: number, date: string, note?: string): void {
  const list = getSales();
  const id = "sale-" + Date.now();
  list.unshift({ id, bookId, amount, date, note: note ?? "" });
  setSales(list);
}
