// Browser-safe exports. Importing from "@/catalog" in a client component would
// bundle the whole product file, so client components import from here instead.
export { formatPrice } from "./price";
export type { ParsedPrice } from "./price";
export type { ProductSummary } from "./types";
