type SectionHeaderProps = {
  id?: string;
  title: string;
  subtitle: string;
  count?: number;
  countLabel?: string;
};

export function SectionHeader({
  id,
  title,
  subtitle,
  count,
  countLabel = "items",
}: SectionHeaderProps) {
  return (
    <div className="section-header mb-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 id={id} className="section-header__title">
              {title}
            </h2>
            {count !== undefined ? (
              <span className="rounded-full bg-orange-100/80 px-2.5 py-0.5 text-xs font-semibold text-orange-900/70">
                {count} {count === 1 ? countLabel.replace(/s$/, "") : countLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
