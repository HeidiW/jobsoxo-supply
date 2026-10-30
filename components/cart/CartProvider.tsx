"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ProductSummary } from "@/catalog/client";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  subscribeToCart,
  writeCart,
} from "@/lib/cart";

export interface CartLine {
  product: ProductSummary;
  quantity: number;
}

interface CartContextValue {
  /** False until the browser's saved cart has loaded. */
  isReady: boolean;
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  quantityOf: (id: string) => number;
  addItem: (id: string, quantity: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const subscribeToNothing = () => () => {};

interface CartProviderProps {
  products: ProductSummary[];
  children: ReactNode;
}

export function CartProvider({ products, children }: CartProviderProps) {
  const storedLines = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const value = useMemo<CartContextValue>(() => {
    const productsById = new Map(products.map((product) => [product.id, product]));

    // The catalog decides what's real: lines for products that no longer exist
    // or are out of stock drop out, and quantities stay within inventory.
    const lines = storedLines.flatMap(({ id, quantity }) => {
      const product = productsById.get(id);
      return product && product.inventory > 0
        ? [{ product, quantity: Math.min(quantity, product.inventory) }]
        : [];
    });

    const addItem = (id: string, quantity: number) => {
      const inventory = productsById.get(id)?.inventory ?? 0;
      if (inventory === 0) return;

      const current = getCartSnapshot();
      const existing = current.find((line) => line.id === id);
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, inventory);

      writeCart(
        existing
          ? current.map((line) =>
              line.id === id ? { ...line, quantity: nextQuantity } : line,
            )
          : [...current, { id, quantity: nextQuantity }],
      );
    };

    const setQuantity = (id: string, quantity: number) => {
      const inventory = productsById.get(id)?.inventory ?? 0;
      const nextQuantity = Math.max(1, Math.min(quantity, inventory));

      writeCart(
        getCartSnapshot().map((line) =>
          line.id === id ? { ...line, quantity: nextQuantity } : line,
        ),
      );
    };

    const removeItem = (id: string) => {
      writeCart(getCartSnapshot().filter((line) => line.id !== id));
    };

    return {
      isReady,
      lines,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      subtotalCents: lines.reduce(
        (total, line) => total + line.product.unitPrice.cents * line.quantity,
        0,
      ),
      quantityOf: (id) =>
        lines.find((line) => line.product.id === id)?.quantity ?? 0,
      addItem,
      setQuantity,
      removeItem,
      clearCart: () => writeCart([]),
    };
  }, [products, storedLines, isReady]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const cart = useContext(CartContext);
  if (!cart) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return cart;
}
