import type { Metadata } from "next";
import { PaymentView } from "@/components/checkout/PaymentView";
import { getStripeConfig } from "@/lib/payment";

export const metadata: Metadata = { title: "Payment" };

export default function PaymentPage() {
  const publishableKey = getStripeConfig()?.publishableKey ?? null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
        Payment
      </h1>
      <PaymentView publishableKey={publishableKey} />
    </div>
  );
}
