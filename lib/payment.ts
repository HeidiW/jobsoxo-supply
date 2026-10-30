import "server-only";

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
}

/**
 * Stripe runs only with a pair of test keys. Missing or live keys return null,
 * which falls back to the mock payment form, so this site can't take real money.
 */
export function getStripeConfig(): StripeConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (secretKey?.startsWith("sk_test_") && publishableKey?.startsWith("pk_test_")) {
    return { publishableKey, secretKey };
  }
  return null;
}
