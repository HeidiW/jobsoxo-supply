"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  value: number;
  max: number;
  label: string;
  onChange: (quantity: number) => void;
}

export function QuantitySelector({
  value,
  max,
  label,
  onChange,
}: QuantitySelectorProps) {
  // Lets the field be cleared while typing without committing an invalid value.
  const [draft, setDraft] = useState<string | null>(null);

  const handleTyping = (text: string) => {
    setDraft(text);
    const quantity = Number(text);
    if (Number.isInteger(quantity) && quantity > 0) {
      onChange(Math.min(quantity, max));
    }
  };

  const step = (quantity: number) => {
    setDraft(null);
    onChange(quantity);
  };

  const buttonClass =
    "flex size-11 items-center justify-center text-xl font-semibold transition-colors hover:bg-plaster disabled:text-line disabled:hover:bg-transparent";

  return (
    <div className="inline-flex border border-line bg-white">
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= 1}
        onClick={() => step(value - 1)}
        className={buttonClass}
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={draft ?? value}
        onChange={(event) => handleTyping(event.target.value)}
        onBlur={() => setDraft(null)}
        className="w-12 border-x border-line text-center font-semibold"
      />
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => step(value + 1)}
        className={buttonClass}
      >
        +
      </button>
    </div>
  );
}
