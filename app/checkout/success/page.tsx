import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = { title: "Order confirmation" };

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Suspense fallback={<p className="text-steel">Loading your order…</p>}>
        <OrderConfirmation />
      </Suspense>
    </div>
  );
}
