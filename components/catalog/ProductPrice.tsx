import { formatPrice, getUnitPrice, parsePrice, type Product } from "@/catalog";

export function ProductPrice({ product }: { product: Product }) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-lg font-semibold">
        {formatPrice(getUnitPrice(product))}
      </span>
      {product.sale_price && (
        <span className="text-steel line-through">
          <span className="sr-only">Regular price </span>
          {formatPrice(parsePrice(product.price))}
        </span>
      )}
    </p>
  );
}
