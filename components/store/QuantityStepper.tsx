type QuantityStepperProps = {
  quantity: number;
  unitLabel: string;
  onAdd: () => void;
  onRemove: () => void;
  productName: string;
  size?: "sm" | "md";
};

export function QuantityStepper({
  quantity,
  unitLabel,
  onAdd,
  onRemove,
  productName,
  size = "md",
}: QuantityStepperProps) {
  const plural = quantity === 1 ? unitLabel : `${unitLabel}s`;
  const buttonSize = size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9";
  const countSize = size === "sm" ? "min-w-7 text-xs" : "min-w-8 text-sm";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onRemove}
        disabled={quantity === 0}
        className={`${buttonSize} flex shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label={`Remove one ${unitLabel} at ${productName}`}
      >
        −
      </button>
      <span className={`${countSize} text-center font-medium tabular-nums text-stone-900`}>
        {quantity}
        {quantity > 0 ? (
          <span className="block text-[10px] font-normal uppercase tracking-wide text-stone-400">
            {plural}
          </span>
        ) : null}
      </span>
      <button
        type="button"
        onClick={onAdd}
        className={`${buttonSize} flex shrink-0 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition hover:bg-stone-800`}
        aria-label={`Add one ${unitLabel} at ${productName}`}
      >
        +
      </button>
    </div>
  );
}
