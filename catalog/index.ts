import categoriesJson from "./categories.json";
import productsJson from "./products.json";
import { toAbsoluteUrl } from "./site-url";
import type { Category, Product, StoredProduct } from "./types";
import { assertValidCatalog } from "./validate";

export { formatPrice, getUnitPrice, parsePrice } from "./price";
export type { ParsedPrice } from "./price";
export { getSiteUrl } from "./site-url";
export type { Availability, Category, Product, ProductCustomFields } from "./types";

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

export function getCategories(): Category[] {
  return storedCategories.map(hydrateCategory);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((category) => category.slug === slug);
}
