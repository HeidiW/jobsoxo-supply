"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { discardOrder, readOrder, saveOrder, type Order } from "@/lib/checkout";
import { OrderSummary } from "./OrderSummary";

function Notice({
  title,
  message,
  href,
  linkLabel,
}: {
  title: string;
  message: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-lg text-steel">{message}</p>
      <Link
        href={href}
        className="mt-5 inline-block bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark"
      >
        {linkLabel}
      </Link>
    </>
  );
}

function ConfirmedOrder({ order }: { order: Order }) {
  const { details } = order;

  return (
    <>
      <p className="font-semibold uppercase tracking-widest text-safety-dark">
        Test order only
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold uppercase tracking-wide sm:text-5xl">
        Thanks for your order
      </h1>
      <p className="mt-3 text-lg text-steel">
        Your order number is{" "}
        <span className="font-mono font-semibold text-ink">{order.number}</span>
        . This is a test site, so nothing will ship and no money has moved.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
        <dl className="grid gap-5 border border-line bg-white p-5 sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Contact</dt>
            <dd className="mt-1 text-steel">
              {details.fullName}
              <br />
              {details.email}
              {details.phone && (
                <>
                  <br />
                  {details.phone}
                </>
              )}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Ship to</dt>
            <dd className="mt-1 text-steel">
              {details.address1}
              {details.address2 && (
                <>
                  <br />
                  {details.address2}
                </>
              )}
              <br />
              {details.city}, {details.state} {details.zip}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Payment</dt>
            <dd className="mt-1 text-steel">
              {order.paymentMethod === "stripe"
                ? "Stripe test mode"
                : "Simulated payment"}
            </dd>
          </div>
        </dl>
        <OrderSummary
          lines={order.lines}
          totalCents={order.totalCents}
          currency={order.currency}
        />
      </div>

      <Link
        href="/"
        className="mt-8 inline-block bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark"
      >
        Back to home
      </Link>
    </>
  );
}

function ConfirmationContent() {
  const { clearCart } = useCart();
  const redirectStatus = useSearchParams().get("redirect_status");
  const [order] = useState(readOrder);

  const paymentFailed = redirectStatus !== null && redirectStatus !== "succeeded";

  useEffect(() => {
    if (paymentFailed) {
      discardOrder();
      return;
    }

    // Reads storage, not state: clearing the cart reruns this effect, and a
    // revisit to this page must not empty a cart started after the order.
    const pendingOrder = readOrder();
    if (pendingOrder && !pendingOrder.confirmed) {
      saveOrder({ ...pendingOrder, confirmed: true });
      clearCart();
    }
  }, [clearCart, paymentFailed]);

  if (paymentFailed) {
    return (
      <Notice
        title="Payment not completed"
        message="Your card wasn't charged, and your cart is still saved."
        href="/checkout/payment"
        linkLabel="Try again"
      />
    );
  }

  if (!order) {
    return (
      <Notice
        title="No recent order"
        message="We couldn't find an order from this session."
        href="/"
        linkLabel="Back to home"
      />
    );
  }

  return <ConfirmedOrder order={order} />;
}

export function OrderConfirmation() {
  const { isReady } = useCart();

  if (!isReady) {
    return <p className="text-steel">Loading your order…</p>;
  }

  return <ConfirmationContent />;
}
