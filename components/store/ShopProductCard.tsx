"use client";

import { useCart } from "@/components/cart-context";
import { QuantityStepper } from "@/components/store/QuantityStepper";
import { formatUsd } from "@/components/ui/format-usd";
import { type Product } from "@/lib/store";

type ShopProductCardProps = {
  product: Product;
};

export function ShopProductCard({ product }: ShopProductCardProps) {
  const { cart, addItem, removeItem } = useCart();
  const quantity = cart[product.id] ?? 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        {quantity > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-stone-900/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {quantity} in cart
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-snug text-stone-900">{product.name}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone-500">
              {product.description}
            </p>
          </div>
          <span className="text-lg opacity-40" aria-hidden>
            {product.emoji}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-4">
            <p className="text-lg font-semibold tracking-tight text-stone-900">
              {formatUsd(product.unitPrice)}
            </p>
            <QuantityStepper
              quantity={quantity}
              unitLabel="item"
              onAdd={() => addItem(product.id)}
              onRemove={() => removeItem(product.id)}
              productName={product.name}
              size="sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
