import type { ProductSummary } from "@/catalog/client";

export interface StoredCartLine {
  id: string;
  quantity: number;
}

export interface CartLine {
  product: ProductSummary;
  quantity: number;
}

const STORAGE_KEY = "jobsoxo-cart";
const EMPTY_CART: StoredCartLine[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLines = EMPTY_CART;

function parseLines(raw: string | null): StoredCartLine[] {
  if (!raw) return EMPTY_CART;

  try {
    const lines: unknown = JSON.parse(raw);
    if (!Array.isArray(lines)) return EMPTY_CART;

    return lines.filter(
      (line): line is StoredCartLine =>
        typeof line?.id === "string" &&
        Number.isInteger(line?.quantity) &&
        line.quantity > 0,
    );
  } catch {
    return EMPTY_CART;
  }
}

/** Returns the same array until the stored value changes, as React requires. */
export function getCartSnapshot(): StoredCartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedLines;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parseLines(raw);
  }
  return cachedLines;
}

export function getServerCartSnapshot(): StoredCartLine[] {
  return EMPTY_CART;
}

export function writeCart(lines: StoredCartLine[]): void {
  const raw = JSON.stringify(lines);
  cachedRaw = raw;
  cachedLines = lines;

  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Storage can be full or blocked; the cart still works for this page view.
  }

  listeners.forEach((listener) => listener());
}

export function subscribeToCart(listener: () => void): () => void {
  // Fires when another tab changes the cart.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };

  listeners.add(listener);
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
