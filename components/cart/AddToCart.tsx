"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { QuantitySelector } from "./QuantitySelector";

interface AddToCartProps {
  productId: string;
  inventory: number;
}

export function AddToCart({ productId, inventory }: AddToCartProps) {
  const { addItem, quantityOf } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [lastAdded, setLastAdded] = useState(0);

  if (inventory === 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full bg-line px-6 py-3 font-semibold text-steel sm:w-auto"
      >
        Out of stock
      </button>
    );
  }

  const inCart = quantityOf(productId);
  const available = inventory - inCart;
  const selected = Math.min(quantity, Math.max(available, 1));

  const handleAdd = () => {
    addItem(productId, selected);
    setLastAdded(selected);
    setQuantity(1);
  };

  return (
    <div>
      <p className="text-sm text-steel">{inventory} in stock</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <QuantitySelector
          value={selected}
          max={Math.max(available, 1)}
          label="quantity"
          onChange={(next) => {
            setQuantity(next);
            setLastAdded(0);
          }}
        />
        <button
          type="button"
          disabled={available === 0}
          onClick={handleAdd}
          className="flex-1 bg-safety px-6 py-2.5 font-semibold text-ink transition-colors hover:bg-safety-dark disabled:bg-line disabled:text-steel sm:flex-none"
        >
          Add to Cart
        </button>
      </div>
      <p role="status" className="mt-3 min-h-6 text-steel">
        {lastAdded > 0 && (
          <>
            Added {lastAdded} to your cart.{" "}
            <Link href="/cart" className="font-semibold text-ink underline">
              View cart
            </Link>
          </>
        )}
        {lastAdded === 0 && available === 0 && (
          <>
            All available stock is in your cart.{" "}
            <Link href="/cart" className="font-semibold text-ink underline">
              View cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
