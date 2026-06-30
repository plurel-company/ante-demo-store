import type { CartFee } from "@splitante/sdk";

import { PRODUCTS } from "@/lib/catalog";
import type { AnteCart, CartFeeLine, CartLine, CartState } from "@/lib/types";

export function buildProductCartLines(cart: CartState): CartLine[] {
  return PRODUCTS.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => ({
    id: product.id,
    name: product.name,
    quantity: cart[product.id],
    unit_price: product.unitPrice,
    image_url: product.imageUrl,
  }));
}

export function buildCartFees(cart: CartState): CartFee[] {
  const fees: CartFee[] = [];

  for (const product of PRODUCTS) {
    const nights = cart[product.id] ?? 0;
    if (nights === 0 || !product.fees?.length) continue;

    for (const fee of product.fees) {
      const amount = fee.billing === "per_night" ? fee.amount * nights : fee.amount;
      fees.push({
        id: `${product.id}-${fee.id}`,
        label: fee.label,
        amount,
      });
    }
  }

  return fees.sort((a, b) => a.id.localeCompare(b.id));
}

export function buildCartFeeSummary(cart: CartState): CartFeeLine[] {
  return buildCartFees(cart).map((fee) => ({
    id: fee.id,
    label: fee.label,
    amount: fee.amount,
  }));
}

export function cartSubtotal(cart: CartState): number {
  return buildProductCartLines(cart).reduce(
    (sum, line) => sum + line.quantity * line.unit_price,
    0,
  );
}

export function cartFeesTotal(cart: CartState): number {
  return buildCartFeeSummary(cart).reduce((sum, fee) => sum + fee.amount, 0);
}

function cartHasShopItems(cart: CartState): boolean {
  return PRODUCTS.some(
    (product) => product.category === "shop" && (cart[product.id] ?? 0) > 0,
  );
}

export function makeOrderRef(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}

/** Build the signed cart payload for Ante checkout (tax/shipping are demo approximations). */
export function buildAnteCart(cart: CartState, orderRef: string): AnteCart {
  const items = buildProductCartLines(cart);
  const fees = buildCartFees(cart);
  const feesTotal = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const merchandiseSubtotal = cartSubtotal(cart);
  const tax = Math.round(merchandiseSubtotal * 0.08);
  const shipping = cartHasShopItems(cart) ? 500 : 0;

  return {
    total: merchandiseSubtotal + tax + shipping + feesTotal,
    currency: "usd",
    items,
    tax,
    shipping,
    ...(fees.length > 0 ? { fees } : {}),
    metadata: { order_ref: orderRef },
  };
}
