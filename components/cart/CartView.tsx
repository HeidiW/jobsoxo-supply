"use client";

import Link from "next/link";
import { formatPrice } from "@/catalog/client";
import { CartLineItem } from "./CartLineItem";
import { useCart } from "./CartProvider";

export function CartView() {
  const { isReady, lines, itemCount, subtotalCents } = useCart();

  if (!isReady) {
    return <p className="mt-6 text-steel">Loading your cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="mt-6">
        <p className="text-lg text-steel">Your cart is empty.</p>
        <Link
          href="/#categories"
          className="mt-4 inline-block bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark"
        >
          Shop by category
        </Link>
      </div>
    );
  }

  const subtotal = formatPrice({
    cents: subtotalCents,
    currency: lines[0].product.unitPrice.currency,
  });

  return (
    <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <ul className="border-t border-line">
        {lines.map((line) => (
          <CartLineItem key={line.product.id} line={line} />
        ))}
      </ul>
      <section
        aria-labelledby="summary-heading"
        className="border border-line bg-white p-5"
      >
        <h2
          id="summary-heading"
          className="font-display text-2xl font-bold uppercase tracking-wide"
        >
          Summary
        </h2>
        <dl className="mt-3 flex items-baseline justify-between">
          <dt>
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="text-xl font-semibold">{subtotal}</dd>
        </dl>
        <Link
          href="/checkout"
          className="mt-5 block bg-safety px-5 py-3 text-center font-semibold text-ink transition-colors hover:bg-safety-dark"
        >
          Proceed to Checkout
        </Link>
      </section>
    </div>
  );
}
