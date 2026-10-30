import type { CartLine } from "./cart";

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

export interface OrderLine {
  id: string;
  title: string;
  quantity: number;
  lineCents: number;
}

export type PaymentMethod = "stripe" | "mock";

export interface Order {
  number: string;
  details: CheckoutDetails;
  lines: OrderLine[];
  totalCents: number;
  currency: string;
  paymentMethod: PaymentMethod;
  /** Set once the confirmation page has cleared the cart for this order. */
  confirmed: boolean;
}

// sessionStorage, not localStorage: these details go away with the tab.
const DETAILS_KEY = "jobsoxo-checkout-details";
const ORDER_KEY = "jobsoxo-order";

function readJson<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; the flow sends the shopper back a step.
  }
}

export const readCheckoutDetails = () =>
  readJson<CheckoutDetails>(DETAILS_KEY);

export const saveCheckoutDetails = (details: CheckoutDetails) =>
  writeJson(DETAILS_KEY, details);

export const readOrder = () => readJson<Order>(ORDER_KEY);

export const saveOrder = (order: Order) => writeJson(ORDER_KEY, order);

export function discardOrder(): void {
  try {
    window.sessionStorage.removeItem(ORDER_KEY);
  } catch {
    // Nothing to clean up if storage is blocked.
  }
}

export function toOrderLines(cartLines: CartLine[]): OrderLine[] {
  return cartLines.map(({ product, quantity }) => ({
    id: product.id,
    title: product.title,
    quantity,
    lineCents: product.unitPrice.cents * quantity,
  }));
}

export function createOrder(
  details: CheckoutDetails,
  cartLines: CartLine[],
  paymentMethod: PaymentMethod,
): Order {
  const lines = toOrderLines(cartLines);

  return {
    number: `JOX-ORD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    details,
    lines,
    totalCents: lines.reduce((total, line) => total + line.lineCents, 0),
    currency: cartLines[0].product.unitPrice.currency,
    paymentMethod,
    confirmed: false,
  };
}
