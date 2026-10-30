import { formatPrice } from "@/catalog/client";
import type { OrderLine } from "@/lib/checkout";

interface OrderSummaryProps {
  lines: OrderLine[];
  totalCents: number;
  currency: string;
}

export function OrderSummary({ lines, totalCents, currency }: OrderSummaryProps) {
  return (
    <section
      aria-labelledby="order-summary-heading"
      className="border border-line bg-white p-5"
    >
      <h2
        id="order-summary-heading"
        className="font-display text-2xl font-bold uppercase tracking-wide"
      >
        Order summary
      </h2>
      <ul className="mt-3 divide-y divide-line">
        {lines.map((line) => (
          <li key={line.id} className="flex justify-between gap-4 py-2.5">
            <span className="min-w-0">
              {line.title}
              <span className="text-steel"> × {line.quantity}</span>
            </span>
            <span className="font-semibold">
              {formatPrice({ cents: line.lineCents, currency })}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 flex items-baseline justify-between border-t border-ink pt-3">
        <dt className="font-semibold">Total</dt>
        <dd className="text-xl font-semibold">
          {formatPrice({ cents: totalCents, currency })}
        </dd>
      </dl>
      <p className="mt-1 text-sm text-steel">
        No shipping or tax on this test site.
      </p>
    </section>
  );
}
