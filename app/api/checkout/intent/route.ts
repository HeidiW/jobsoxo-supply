import Stripe from "stripe";
import { getProductById, getUnitPrice } from "@/catalog";
import { getStripeConfig } from "@/lib/payment";

const MAX_LINES = 50;
const MAX_METADATA_LENGTH = 500;

interface PricedCart {
  amountCents: number;
  currency: string;
  summary: string;
}

/**
 * Prices the cart from the catalog. The browser sends only IDs and quantities,
 * so it can't choose what it gets charged.
 */
function priceItems(items: unknown): PricedCart | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return null;
  }

  let amountCents = 0;
  let currency = "";
  const summary: string[] = [];

  for (const item of items) {
    const product =
      typeof item?.id === "string" ? getProductById(item.id) : undefined;
    const quantity: unknown = item?.quantity;

    if (
      !product ||
      !Number.isInteger(quantity) ||
      (quantity as number) < 1 ||
      (quantity as number) > product.inventory
    ) {
      return null;
    }

    const unitPrice = getUnitPrice(product);
    amountCents += unitPrice.cents * (quantity as number);
    currency = unitPrice.currency;
    summary.push(`${product.id} x${quantity}`);
  }

  return { amountCents, currency, summary: summary.join(", ") };
}

export async function POST(request: Request) {
  const stripeConfig = getStripeConfig();
  if (!stripeConfig) {
    return Response.json(
      { error: "Stripe test keys are not configured." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const cart = priceItems(body?.items);
  if (!cart) {
    return Response.json(
      { error: "The cart has invalid items." },
      { status: 400 },
    );
  }

  try {
    const stripe = new Stripe(stripeConfig.secretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.amountCents,
      currency: cart.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: { items: cart.summary.slice(0, MAX_METADATA_LENGTH) },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Could not create a PaymentIntent", error);
    return Response.json(
      { error: "Stripe could not start this payment." },
      { status: 502 },
    );
  }
}
