import type { Product } from "../types";

export interface JsonFeed {
  title: string;
  link: string;
  products: Product[];
}

/** Lists fields in schema order, so the feed reads like the documentation. */
function toFeedItem(product: Product): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    availability: product.availability,
    condition: product.condition,
    price: product.price,
    sale_price: product.sale_price,
    link: product.link,
    image_link: product.image_link,
    additional_image_link: product.additional_image_link,
    brand: product.brand,
    product_type: product.product_type,
    google_product_category: product.google_product_category,
    item_group_id: product.item_group_id,
    inventory: product.inventory,
    custom: product.custom,
  };
}

/** The full catalog with absolute URLs, including the storefront's custom fields. */
export function buildJsonFeed(products: Product[], siteUrl: string): JsonFeed {
  return {
    title: "JobsOxo Supply",
    link: siteUrl,
    products: products.map(toFeedItem),
  };
}
