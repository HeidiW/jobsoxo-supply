"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { CartLine } from "@/lib/cart";
import { discardOrder, saveOrder, type Order } from "@/lib/checkout";

const APPEARANCE: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#d97706",
    colorText: "#1c2126",
    borderRadius: "0px",
  },
};

const GENERIC_ERROR = "The payment didn't go through. Please try again.";

interface StripePaymentFormProps {
  createPendingOrder: () => Order;
  payLabel: string;
}

function StripePaymentForm({
  createPendingOrder,
  payLabel,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsPaying(true);
    setErrorMessage(null);

    // Saved first because Stripe may redirect away to authenticate the card.
    saveOrder(createPendingOrder());

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (error || paymentIntent?.status !== "succeeded") {
      discardOrder();
      setErrorMessage(error?.message ?? GENERIC_ERROR);
      setIsPaying(false);
      return;
    }

    router.push("/checkout/success");
  };

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white p-5">
      <PaymentElement />
      {errorMessage && (
        <p role="alert" className="mt-4 font-semibold text-red-700">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || isPaying}
        className="mt-5 w-full bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark disabled:bg-line disabled:text-steel"
      >
        {isPaying ? "Processing…" : payLabel}
      </button>
    </form>
  );
}

interface StripePaymentProps extends StripePaymentFormProps {
  publishableKey: string;
  lines: CartLine[];
}

export function StripePayment({
  publishableKey,
  lines,
  createPendingOrder,
  payLabel,
}: StripePaymentProps) {
  const [stripePromise] = useState(() => loadStripe(publishableKey));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const items = lines.map(({ product, quantity }) => ({
      id: product.id,
      quantity,
    }));

    fetch("/api/checkout/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.clientSecret) {
          throw new Error(data.error);
        }
        if (isCurrent) setClientSecret(data.clientSecret);
      })
      .catch(() => {
        if (isCurrent) setLoadFailed(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [lines]);

  if (loadFailed) {
    return (
      <p role="alert" className="border border-line bg-white p-5 font-semibold text-red-700">
        We couldn&apos;t start the Stripe payment. Please refresh the page and
        try again.
      </p>
    );
  }

  if (!clientSecret) {
    return (
      <p className="border border-line bg-white p-5 text-steel">
        Loading secure payment form…
      </p>
    );
  }

  return (
    <Elements
      key={clientSecret}
      stripe={stripePromise}
      options={{ clientSecret, appearance: APPEARANCE }}
    >
      <StripePaymentForm
        createPendingOrder={createPendingOrder}
        payLabel={payLabel}
      />
    </Elements>
  );
}
