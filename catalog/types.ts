export type Availability = "in stock" | "out of stock";

/** Storefront-only fields. Never included in external feeds. */
export interface ProductCustomFields {
  slug: string;
  category_slug: string;
  short_description: string;
  specs: Record<string, string>;
}

/** Fields shared by the stored record and the hydrated product. */
interface ProductBase {
  id: string;
  title: string;
  description: string;
  availability: Availability;
  condition: "new";
  price: string;
  sale_price?: string;
  brand: string;
  product_type: string;
  google_product_category: string;
  item_group_id?: string;
  inventory: number;
  custom: ProductCustomFields;
}

/**
 * A record as written in products.json. Image paths may be site-relative and
 * `link` is omitted, because both depend on SITE_URL.
 */
export interface StoredProduct extends ProductBase {
  image_link: string;
  additional_image_link?: string[];
}

/** A product as the rest of the app sees it, with absolute URLs. */
export interface Product extends ProductBase {
  link: string;
  image_link: string;
  additional_image_link?: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image_link: string;
}
