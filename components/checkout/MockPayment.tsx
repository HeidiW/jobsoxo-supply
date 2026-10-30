"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Order } from "@/lib/checkout";
import { saveOrder } from "@/lib/checkout";

const SIMULATED_DELAY_MS = 800;

const TEST_CARD_FIELDS = [
  { label: "Card number", value: "4242 4242 4242 4242", className: "col-span-2" },
  { label: "Expiry", value: "12 / 34", className: "" },
  { label: "CVC", value: "123", className: "" },
];

interface MockPaymentProps {
  createPendingOrder: () => Order;
  payLabel: string;
}

export function MockPayment({ createPendingOrder, payLabel }: MockPaymentProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPaying(true);

    setTimeout(() => {
      saveOrder(createPendingOrder());
      router.push("/checkout/success");
    }, SIMULATED_DELAY_MS);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white p-5">
      <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
        Simulated payment
      </h2>
      <p className="mt-1 text-steel">
        Stripe test keys aren&apos;t set, so this form simulates a successful
        payment. The fields are locked, so no card details are collected.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {TEST_CARD_FIELDS.map((field) => (
          <label key={field.label} className={`block ${field.className}`}>
            <span className="font-semibold">{field.label}</span>
            <input
              value={field.value}
              readOnly
              className="mt-1 block w-full border border-line bg-plaster px-3 py-2.5 font-mono text-steel"
            />
          </label>
        ))}
      </div>
      <button
        type="submit"
        disabled={isPaying}
        className="mt-5 w-full bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark disabled:bg-line disabled:text-steel"
      >
        {isPaying ? "Processing…" : payLabel}
      </button>
    </form>
  );
}
