"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/catalog/client";
import { useCart } from "@/components/cart/CartProvider";
import {
  createOrder,
  readCheckoutDetails,
  toOrderLines,
} from "@/lib/checkout";
import { MockPayment } from "./MockPayment";
import { OrderSummary } from "./OrderSummary";
import { StripePayment } from "./StripePayment";
import { TestCardNotice } from "./TestCardNotice";

function PaymentContent({ publishableKey }: { publishableKey: string | null }) {
  const router = useRouter();
  const { lines, subtotalCents } = useCart();
  const [details] = useState(readCheckoutDetails);

  const isMissingSteps = lines.length === 0 || !details;

  useEffect(() => {
    if (lines.length === 0) {
      router.replace("/cart");
    } else if (!details) {
      router.replace("/checkout");
    }
  }, [details, lines.length, router]);

  if (isMissingSteps) {
    return <p className="mt-6 text-steel">Taking you back a step…</p>;
  }

  const currency = lines[0].product.unitPrice.currency;
  const payLabel = `Pay ${formatPrice({ cents: subtotalCents, currency })}`;

  const paymentProps = {
    payLabel,
    createPendingOrder: () =>
      createOrder(details, lines, publishableKey ? "stripe" : "mock"),
  };

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="flex flex-col gap-6">
        <TestCardNotice />
        {publishableKey ? (
          <StripePayment
            publishableKey={publishableKey}
            lines={lines}
            {...paymentProps}
          />
        ) : (
          <MockPayment {...paymentProps} />
        )}
      </div>
      <OrderSummary
        lines={toOrderLines(lines)}
        totalCents={subtotalCents}
        currency={currency}
      />
    </div>
  );
}

export function PaymentView({
  publishableKey,
}: {
  publishableKey: string | null;
}) {
  const { isReady } = useCart();

  if (!isReady) {
    return <p className="mt-6 text-steel">Loading payment…</p>;
  }

  return <PaymentContent publishableKey={publishableKey} />;
}
