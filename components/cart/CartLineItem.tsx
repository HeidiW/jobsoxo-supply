"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/catalog/client";
import type { CartLine } from "@/lib/cart";
import { useCart } from "./CartProvider";
import { QuantitySelector } from "./QuantitySelector";

export function CartLineItem({ line }: { line: CartLine }) {
  const { setQuantity, removeItem } = useCart();
  const { product, quantity } = line;
  const { cents, currency } = product.unitPrice;

  return (
    <li className="flex gap-4 border-b border-line py-5">
      <Image
        src={product.image}
        alt=""
        width={96}
        height={96}
        unoptimized={product.image.startsWith("http")}
        className="size-20 shrink-0 bg-line object-cover sm:size-24"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={`/product/${product.slug}`}
            className="font-semibold hover:underline"
          >
            {product.title}
          </Link>
          <p className="text-steel">
            {formatPrice(product.unitPrice)} each
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <QuantitySelector
            value={quantity}
            max={product.inventory}
            label={`quantity of ${product.title}`}
            onChange={(next) => setQuantity(product.id, next)}
          />
          <p className="w-20 font-semibold sm:text-right">
            {formatPrice({ cents: cents * quantity, currency })}
          </p>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.title}`}
            className="py-2 text-steel underline hover:text-ink"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
