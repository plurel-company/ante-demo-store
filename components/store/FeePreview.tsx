import { formatUsd } from "@/components/ui/format-usd";
import { type ProductFee } from "@/lib/store";

type FeePreviewProps = {
  fees: ProductFee[];
  compact?: boolean;
};

export function FeePreview({ fees, compact = false }: FeePreviewProps) {
  if (!fees.length) return null;

  return (
    <div
      className={
        compact
          ? "mt-3 rounded-lg bg-stone-50 px-3 py-2.5"
          : "mt-4 rounded-xl border border-stone-100 bg-stone-50/80 px-3.5 py-3"
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        Fees at checkout
      </p>
      <ul className="mt-1.5 space-y-1">
        {fees.map((fee) => (
          <li key={fee.id} className="flex justify-between gap-3 text-xs text-stone-600">
            <span className="truncate">{fee.label}</span>
            <span className="shrink-0 font-medium text-stone-700">
              {formatUsd(fee.amount)}
              <span className="font-normal text-stone-400">
                {fee.billing === "per_night" ? " / night" : " / stay"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
