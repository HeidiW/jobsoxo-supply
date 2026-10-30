import { parsePrice } from "./price";
import type { Category, StoredProduct } from "./types";

const BRAND = "JobsOxo Supply";
const CURRENCY = "USD";
const REQUIRED_TEXT_FIELDS = [
  "id",
  "title",
  "description",
  "price",
  "image_link",
  "product_type",
  "google_product_category",
] as const;

function isImageReference(value: string): boolean {
  return value.startsWith("/") || /^https?:\/\//.test(value);
}

function validatePrice(price: string): string | null {
  try {
    return parsePrice(price).currency === CURRENCY
      ? null
      : `price "${price}" must be in ${CURRENCY}`;
  } catch (error) {
    return (error as Error).message;
  }
}

function validateProduct(
  product: StoredProduct,
  categorySlugs: Set<string>,
): string[] {
  const errors: string[] = [];

  for (const field of REQUIRED_TEXT_FIELDS) {
    if (typeof product[field] !== "string" || product[field].trim() === "") {
      errors.push(`${field} is required`);
    }
  }
  if (!product.custom) {
    return [...errors, "custom is required"];
  }

  if ("link" in product) {
    errors.push("link must not be stored; it is built from SITE_URL");
  }
  if (product.availability !== "in stock" && product.availability !== "out of stock") {
    errors.push(`availability "${product.availability}" is not valid`);
  }
  if (product.condition !== "new") {
    errors.push(`condition must be "new"`);
  }
  if (product.brand !== BRAND) {
    errors.push(`brand must be "${BRAND}"`);
  }
  if (/<[^>]+>/.test(product.description ?? "")) {
    errors.push("description must be plain text");
  }

  if (!Number.isInteger(product.inventory) || product.inventory < 0) {
    errors.push("inventory must be a non-negative integer");
  } else if ((product.availability === "in stock") !== product.inventory > 0) {
    errors.push(
      `availability "${product.availability}" conflicts with inventory ${product.inventory}`,
    );
  }

  const priceError = product.price ? validatePrice(product.price) : null;
  if (priceError) errors.push(priceError);
  if (product.sale_price !== undefined) {
    const salePriceError = validatePrice(product.sale_price);
    if (salePriceError) {
      errors.push(salePriceError);
    } else if (
      !priceError &&
      product.price &&
      parsePrice(product.sale_price).cents >= parsePrice(product.price).cents
    ) {
      errors.push("sale_price must be lower than price");
    }
  }

  const images = [product.image_link, ...(product.additional_image_link ?? [])];
  for (const image of images) {
    if (image && !isImageReference(image)) {
      errors.push(`image "${image}" must start with / or http(s)://`);
    }
  }

  const { slug, category_slug, short_description, specs } = product.custom;
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`custom.slug "${slug}" must be lowercase words joined by hyphens`);
  }
  if (!categorySlugs.has(category_slug)) {
    errors.push(`custom.category_slug "${category_slug}" is not a known category`);
  }
  if (!short_description) {
    errors.push("custom.short_description is required");
  }
  if (!specs || Object.keys(specs).length === 0) {
    errors.push("custom.specs needs at least one entry");
  }

  return errors;
}

/** Fails fast, and with a useful message, when the catalog files are edited badly. */
export function assertValidCatalog(
  products: StoredProduct[],
  categories: Category[],
): void {
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const errors: string[] = [];

  products.forEach((product, index) => {
    const label = product.id || `products[${index}]`;
    const productErrors = validateProduct(product, categorySlugs);

    if (seenIds.has(product.id)) productErrors.push("duplicate id");
    seenIds.add(product.id);

    const slug = product.custom?.slug;
    if (seenSlugs.has(slug)) productErrors.push(`duplicate slug "${slug}"`);
    seenSlugs.add(slug);

    errors.push(...productErrors.map((error) => `${label}: ${error}`));
  });

  if (errors.length > 0) {
    throw new Error(`Invalid catalog:\n- ${errors.join("\n- ")}`);
  }
}
