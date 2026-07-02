import { currencySectionTitle, type CurrencyCode } from "@/lib/currency";

import { CurrencyBadge } from "@/components/store/CurrencyBadge";

type CurrencySubheaderProps = {
  currency: CurrencyCode;
  productCount: number;
  countLabel?: string;
};

export function CurrencySubheader({
  currency,
  productCount,
  countLabel = "items",
}: CurrencySubheaderProps) {
  return (
    <div className="currency-subheader">
      <div className="flex items-center gap-2.5">
        <CurrencyBadge currency={currency} size="md" />
        <h3 className="text-sm font-semibold tracking-tight text-stone-800">
          {currencySectionTitle(currency)}
        </h3>
      </div>
      <span className="text-xs text-stone-400">
        {productCount} {productCount === 1 ? countLabel.replace(/s$/, "") : countLabel}
      </span>
    </div>
  );
}
