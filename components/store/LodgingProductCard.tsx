"use client";

import { useCart } from "@/components/cart-context";
import { FeePreview } from "@/components/store/FeePreview";
import { QuantityStepper } from "@/components/store/QuantityStepper";
import { formatUsd } from "@/components/ui/format-usd";
import { type Product } from "@/lib/store";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{label}</dt>
      <dd className="text-sm font-medium text-stone-800">{value}</dd>
    </div>
  );
}

type LodgingProductCardProps = {
  product: Product;
};

export function LodgingProductCard({ product }: LodgingProductCardProps) {
  const { cart, addItem, removeItem } = useCart();
  const quantity = cart[product.id] ?? 0;
  const lodging = product.lodging;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        {quantity > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur-sm">
            {quantity} {quantity === 1 ? "night" : "nights"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-stone-900">
              {product.name}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-500">{product.description}</p>
          </div>
        </div>

        {lodging ? (
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <MetaItem label="Beds" value={lodging.beds} />
            <MetaItem label="Baths" value={lodging.baths} />
            {lodging.sqft ? <MetaItem label="Size" value={lodging.sqft} /> : null}
            {lodging.rooms ? <MetaItem label="Layout" value={lodging.rooms} /> : null}
            {lodging.buildings ? (
              <div className="col-span-2 sm:col-span-4">
                <MetaItem label="Buildings" value={lodging.buildings} />
              </div>
            ) : null}
          </dl>
        ) : null}

        {lodging?.amenities.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {lodging.amenities.map((amenity) => (
              <li
                key={amenity}
                className="rounded-md border border-stone-200 bg-white px-2 py-1 text-xs font-medium text-stone-600"
              >
                {amenity}
              </li>
            ))}
          </ul>
        ) : null}

        {product.fees?.length ? <FeePreview fees={product.fees} /> : null}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-stone-100 pt-4">
          <div>
            <p className="text-xl font-semibold tracking-tight text-stone-900">
              {formatUsd(product.unitPrice)}
              <span className="text-sm font-normal text-stone-500"> / night</span>
            </p>
          </div>
          <QuantityStepper
            quantity={quantity}
            unitLabel="night"
            onAdd={() => addItem(product.id)}
            onRemove={() => removeItem(product.id)}
            productName={product.name}
          />
        </div>
      </div>
    </article>
  );
}
