import type { Product } from "./types";

const PRICE_PATTERN = /^(\d+)\.(\d{2}) ([A-Z]{3})$/;

export interface ParsedPrice {
  cents: number;
  currency: string;
}

/** Parses a feed price such as "24.99 USD". Throws on any other format. */
export function parsePrice(price: string): ParsedPrice {
  const match = PRICE_PATTERN.exec(price);
  if (!match) {
    throw new Error(`Invalid price "${price}". Expected a format like "24.99 USD".`);
  }

  const [, whole, fraction, currency] = match;
  return { cents: Number(whole) * 100 + Number(fraction), currency };
}

/** The amount a customer pays for one unit: the sale price when there is one. */
export function getUnitPrice(
  product: Pick<Product, "price" | "sale_price">,
): ParsedPrice {
  return parsePrice(product.sale_price ?? product.price);
}

export function formatPrice({ cents, currency }: ParsedPrice): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
}
