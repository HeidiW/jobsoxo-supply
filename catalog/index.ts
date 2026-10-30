import categoriesJson from "./categories.json";
import { buildJsonFeed, type JsonFeed } from "./feeds/json";
import { buildMetaCsv } from "./feeds/meta-csv";
import productsJson from "./products.json";
import { getUnitPrice } from "./price";
import { getSiteUrl, toAbsoluteUrl } from "./site-url";
import type {
  Category,
  Product,
  ProductSummary,
  StoredProduct,
  VariantOption,
} from "./types";
import { assertValidCatalog } from "./validate";

export { formatPrice, getUnitPrice, parsePrice } from "./price";
export type { ParsedPrice } from "./price";
export { getSiteUrl, toSitePath } from "./site-url";
export type {
  Availability,
  Category,
  Product,
  ProductCustomFields,
  ProductSummary,
  VariantOption,
} from "./types";

// TypeScript can't narrow JSON imports; assertValidCatalog checks the shape at load.
const storedProducts = productsJson as unknown as StoredProduct[];
const storedCategories = categoriesJson as Category[];

assertValidCatalog(storedProducts, storedCategories);

function hydrateProduct(stored: StoredProduct): Product {
  return {
    ...stored,
    link: toAbsoluteUrl(`/product/${stored.custom.slug}`),
    image_link: toAbsoluteUrl(stored.image_link),
    additional_image_link: stored.additional_image_link?.map(toAbsoluteUrl),
  };
}

function hydrateCategory(stored: Category): Category {
  return { ...stored, image_link: toAbsoluteUrl(stored.image_link) };
}

export function getProducts(): Product[] {
  return storedProducts.map(hydrateProduct);
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.custom.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getProducts().filter(
    (product) => product.custom.category_slug === categorySlug,
  );
}

/** All products sharing this product's item_group_id, including itself. */
export function getProductVariants(product: Product): Product[] {
  if (!product.item_group_id) return [product];
  return getProducts().filter(
    (candidate) => candidate.item_group_id === product.item_group_id,
  );
}

/**
 * The options for a variant picker, labeled by the first spec that differs
 * across the group (blade size for trowels, bag weight for plaster).
 */
export function getVariantOptions(product: Product): VariantOption[] {
  const variants = getProductVariants(product);
  const differingSpec = Object.keys(product.custom.specs).find(
    (spec) =>
      new Set(variants.map((variant) => variant.custom.specs[spec])).size > 1,
  );

  return variants.map((variant) => ({
    id: variant.id,
    slug: variant.custom.slug,
    label: differingSpec ? variant.custom.specs[differingSpec] : variant.title,
  }));
}

export function getProductSummaries(): ProductSummary[] {
  return storedProducts.map((product) => ({
    id: product.id,
    title: product.title,
    slug: product.custom.slug,
    image: product.image_link,
    inventory: product.inventory,
    unitPrice: getUnitPrice(product),
  }));
}

export function getCategories(): Category[] {
  return storedCategories.map(hydrateCategory);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((category) => category.slug === slug);
}

export function getJsonFeed(): JsonFeed {
  return buildJsonFeed(getProducts(), getSiteUrl());
}

export function getMetaCsvFeed(): string {
  return buildMetaCsv(getProducts());
}
