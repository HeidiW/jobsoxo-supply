"use client";

import { useRouter } from "next/navigation";
import { useState, type ComponentProps, type FormEvent } from "react";
import {
  readCheckoutDetails,
  saveCheckoutDetails,
  type CheckoutDetails,
} from "@/lib/checkout";

const NOT_BLANK = ".*\\S.*";

interface FieldProps extends ComponentProps<"input"> {
  label: string;
  name: keyof CheckoutDetails;
}

function Field({ label, className = "", ...inputProps }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="font-semibold">
        {label}
        {!inputProps.required && (
          <span className="font-normal text-steel"> (optional)</span>
        )}
      </span>
      <input
        {...inputProps}
        className="mt-1 block w-full border border-line bg-white px-3 py-2.5"
      />
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const [saved] = useState(readCheckoutDetails);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const text = (name: keyof CheckoutDetails) =>
      String(data.get(name) ?? "").trim();

    saveCheckoutDetails({
      fullName: text("fullName"),
      email: text("email"),
      phone: text("phone"),
      address1: text("address1"),
      address2: text("address2"),
      city: text("city"),
      state: text("state").toUpperCase(),
      zip: text("zip"),
    });
    router.push("/checkout/payment");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 font-display text-2xl font-bold uppercase tracking-wide">
          Contact
        </legend>
        <Field
          label="Full name"
          name="fullName"
          autoComplete="name"
          defaultValue={saved?.fullName}
          pattern={NOT_BLANK}
          required
          className="sm:col-span-2"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={saved?.email}
          required
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={saved?.phone}
        />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-6">
        <legend className="mb-3 font-display text-2xl font-bold uppercase tracking-wide">
          Shipping address
        </legend>
        <Field
          label="Address"
          name="address1"
          autoComplete="address-line1"
          defaultValue={saved?.address1}
          pattern={NOT_BLANK}
          required
          className="sm:col-span-6"
        />
        <Field
          label="Apartment, suite, or unit"
          name="address2"
          autoComplete="address-line2"
          defaultValue={saved?.address2}
          className="sm:col-span-6"
        />
        <Field
          label="City"
          name="city"
          autoComplete="address-level2"
          defaultValue={saved?.city}
          pattern={NOT_BLANK}
          required
          className="sm:col-span-3"
        />
        <Field
          label="State"
          name="state"
          autoComplete="address-level1"
          defaultValue={saved?.state}
          pattern="[A-Za-z]{2}"
          title="Two-letter state code, such as TX"
          maxLength={2}
          required
          className="sm:col-span-1"
        />
        <Field
          label="ZIP code"
          name="zip"
          inputMode="numeric"
          autoComplete="postal-code"
          defaultValue={saved?.zip}
          pattern="\d{5}(-\d{4})?"
          title="5-digit ZIP code, such as 78701"
          required
          className="sm:col-span-2"
        />
      </fieldset>

      <button
        type="submit"
        className="bg-safety px-5 py-3 font-semibold text-ink transition-colors hover:bg-safety-dark sm:self-start"
      >
        Continue to payment
      </button>
    </form>
  );
}
