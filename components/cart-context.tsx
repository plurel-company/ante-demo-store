"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  cartSubtotal,
  getCartCurrency,
  getProduct,
  wouldMixCartCurrency,
  type CartState,
  type CurrencyCode,
} from "@/lib/store";

type CartContextValue = {
  cart: CartState;
  itemCount: number;
  subtotal: number;
  currency: CurrencyCode | null;
  notice: string | null;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  dismissNotice: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const [notice, setNotice] = useState<string | null>(null);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const addItem = useCallback((productId: string) => {
    const product = getProduct(productId);
    if (!product) return;

    setCart((current) => {
      if (wouldMixCartCurrency(current, productId)) {
        const cartCurrency = getCartCurrency(current);
        setNotice(
          `Your cart is in ${cartCurrency}. Finish checkout or remove items before adding ${product.currency} products.`,
        );
        return current;
      }

      setNotice(null);
      return {
        ...current,
        [productId]: (current[productId] ?? 0) + 1,
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[productId] ?? 0) - 1;
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return next;
    });
    setNotice(null);
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    setNotice(null);
  }, []);

  const value = useMemo(() => {
    const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    return {
      cart,
      itemCount,
      subtotal: cartSubtotal(cart),
      currency: getCartCurrency(cart),
      notice,
      addItem,
      removeItem,
      clearCart,
      dismissNotice,
    };
  }, [addItem, cart, clearCart, dismissNotice, notice, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
