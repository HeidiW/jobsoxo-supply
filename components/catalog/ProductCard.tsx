import Link from "next/link";
import type { Product } from "@/catalog";
import { CatalogImage } from "./CatalogImage";
import { ProductPrice } from "./ProductPrice";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.availability === "out of stock";

  return (
    <article className="relative flex flex-col border border-line bg-white transition-colors hover:border-safety">
      <CatalogImage
        src={product.image_link}
        alt={product.title}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col p-4">
        {(isOutOfStock || product.sale_price) && (
          <span className="mb-2 self-start bg-ink px-2 py-0.5 text-sm font-semibold text-white">
            {isOutOfStock ? "Out of stock" : "Sale"}
          </span>
        )}
        <h2 className="font-semibold">
          <Link
            href={`/product/${product.custom.slug}`}
            className="after:absolute after:inset-0"
          >
            {product.title}
          </Link>
        </h2>
        <p className="mt-1 flex-1 text-steel">
          {product.custom.short_description}
        </p>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <ProductPrice product={product} />
          <span aria-hidden="true" className="font-semibold">
            View details
          </span>
        </div>
      </div>
    </article>
  );
}
