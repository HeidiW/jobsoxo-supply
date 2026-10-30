"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { toOrderLines } from "@/lib/checkout";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";

export function CheckoutView() {
  const { isReady, lines, subtotalCents } = useCart();

  if (!isReady) {
    return <p className="mt-6 text-steel">Loading checkout…</p>;
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

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="order-last lg:order-none">
        <p className="mb-6 border-l-4 border-safety bg-white p-3 text-steel">
          This is a test site. Please use made-up contact and address details.
        </p>
        <CheckoutForm />
      </div>
      <OrderSummary
        lines={toOrderLines(lines)}
        totalCents={subtotalCents}
        currency={lines[0].product.unitPrice.currency}
      />
    </div>
  );
}
