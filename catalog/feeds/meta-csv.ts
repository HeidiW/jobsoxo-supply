import type { Product } from "../types";

interface FeedColumn {
  name: string;
  value: (product: Product) => string | number | undefined;
}

/**
 * Meta's catalog columns, as listed in its product data specifications.
 * Nothing from `custom` belongs here. Meta now recommends
 * quantity_to_sell_on_facebook as the name for `inventory`.
 */
const META_COLUMNS: FeedColumn[] = [
  { name: "id", value: (product) => product.id },
  { name: "title", value: (product) => product.title },
  { name: "description", value: (product) => product.description },
  { name: "availability", value: (product) => product.availability },
  { name: "condition", value: (product) => product.condition },
  { name: "price", value: (product) => product.price },
  { name: "sale_price", value: (product) => product.sale_price },
  { name: "link", value: (product) => product.link },
  { name: "image_link", value: (product) => product.image_link },
  {
    name: "additional_image_link",
    value: (product) => product.additional_image_link?.join(","),
  },
  { name: "brand", value: (product) => product.brand },
  { name: "product_type", value: (product) => product.product_type },
  {
    name: "google_product_category",
    value: (product) => product.google_product_category,
  },
  { name: "item_group_id", value: (product) => product.item_group_id },
  {
    name: "quantity_to_sell_on_facebook",
    value: (product) => product.inventory,
  },
];

/** Quotes a value when it contains a delimiter, per RFC 4180. */
function escapeCsvValue(value: string | number | undefined): string {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsvRow(values: (string | number | undefined)[]): string {
  return values.map(escapeCsvValue).join(",");
}

export function buildMetaCsv(products: Product[]): string {
  const header = toCsvRow(META_COLUMNS.map((column) => column.name));
  const rows = products.map((product) =>
    toCsvRow(META_COLUMNS.map((column) => column.value(product))),
  );

  return [header, ...rows].join("\r\n") + "\r\n";
}
