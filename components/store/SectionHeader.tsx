type SectionHeaderProps = {
  id?: string;
  index?: string;
  title: string;
  subtitle: string;
  count?: number;
  countLabel?: string;
};

export function SectionHeader({
  id,
  index,
  title,
  subtitle,
  count,
  countLabel = "items",
}: SectionHeaderProps) {
  return (
    <div className="section-header sec-head mb-10">
      <p className="sec-eyebrow">
        {index ? (
          <>
            <span className="sec-eyebrow__idx">{index}</span>
            <span className="sec-eyebrow__dot" aria-hidden="true" />
          </>
        ) : null}
        <span>
          {count !== undefined
            ? `${count} ${count === 1 ? countLabel.replace(/s$/, "") : countLabel}`
            : "Catalog"}
        </span>
      </p>
      <h2 id={id} className="display sec-title">
        {title}
      </h2>
      <p className="sec-lede">{subtitle}</p>
    </div>
  );
}
