import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
        Your cart
      </h1>
      <CartView />
    </div>
  );
}
