type SectionHeaderProps = {
  title: string;
  subtitle: string;
  count?: number;
  countLabel?: string;
};

export function SectionHeader({ title, subtitle, count, countLabel = "items" }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{title}</h2>
          {count !== undefined ? (
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
              {count} {count === 1 ? countLabel.replace(/s$/, "") : countLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}
