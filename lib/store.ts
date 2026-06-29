import type { Cart } from "@splitante/sdk";

export type Product = {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  emoji: string;
};

/** Ante default minimum order (matches splitante.com merchant settings). */
export const MINIMUM_ORDER_CENTS = 1000;

/** Prices in cents (USD). */
export const PRODUCTS: Product[] = [
  {
    id: "mug",
    name: "Ceramic Mug",
    description: "12 oz matte finish, dishwasher safe.",
    unitPrice: 1800,
    emoji: "☕",
  },
  {
    id: "tote",
    name: "Canvas Tote",
    description: "Heavy cotton, fits a laptop.",
    unitPrice: 2400,
    emoji: "👜",
  },
  {
    id: "stickers",
    name: "Sticker Pack",
    description: "Five weatherproof vinyl stickers.",
    unitPrice: 1200,
    emoji: "✨",
  },
];

export type CartLine = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
};

export type ConfirmedOrder = {
  orderRef: string;
  groupId: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  confirmedAt: number;
  confirmedVia?: "webhook";
};

export type CartState = Record<string, number>;

export function buildCartLines(cart: CartState): CartLine[] {
  return PRODUCTS.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => ({
    id: product.id,
    name: product.name,
    quantity: cart[product.id],
    unit_price: product.unitPrice,
  }));
}

export function cartSubtotal(cart: CartState): number {
  return buildCartLines(cart).reduce(
    (sum, line) => sum + line.quantity * line.unit_price,
    0,
  );
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function makeOrderRef(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

export function buildAnteCart(cart: CartState, orderRef: string): Cart {
  const items = buildCartLines(cart);
  const subtotal = cartSubtotal(cart);
  const tax = Math.round(subtotal * 0.08);
  const shipping = subtotal > 0 ? 500 : 0;

  return {
    total: subtotal + tax + shipping,
    currency: "usd",
    items,
    tax,
    shipping,
    metadata: { order_ref: orderRef },
  };
}
