/**
 * Offline cache for expense tracker.
 * Uses localStorage; keys prefixed with et_ to avoid collisions.
 */

const P = "et_";

export function getCachedTransactions(month: number, year: number): unknown[] | null {
  try {
    const raw = localStorage.getItem(`${P}tx_${year}_${month}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedTransactions(month: number, year: number, data: unknown[]): void {
  try {
    localStorage.setItem(`${P}tx_${year}_${month}`, JSON.stringify(data));
  } catch {}
}

export function getCachedSummary(month: number, year: number): unknown | null {
  try {
    const raw = localStorage.getItem(`${P}summary_${year}_${month}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedSummary(month: number, year: number, data: unknown): void {
  try {
    localStorage.setItem(`${P}summary_${year}_${month}`, JSON.stringify(data));
  } catch {}
}

export function getCachedCategories(): unknown[] | null {
  try {
    const raw = localStorage.getItem(`${P}categories`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedCategories(data: unknown[]): void {
  try {
    localStorage.setItem(`${P}categories`, JSON.stringify(data));
  } catch {}
}

export interface PendingTransaction {
  tempId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  categoryName: string;
  date: string;
  description: string;
}

export function getPendingTransactions(): PendingTransaction[] {
  try {
    const raw = localStorage.getItem(`${P}pending`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPendingTransaction(tx: PendingTransaction): void {
  const list = getPendingTransactions();
  list.push(tx);
  try {
    localStorage.setItem(`${P}pending`, JSON.stringify(list));
  } catch {}
}

export function clearPendingTransactions(): void {
  try {
    localStorage.removeItem(`${P}pending`);
  } catch {}
}
