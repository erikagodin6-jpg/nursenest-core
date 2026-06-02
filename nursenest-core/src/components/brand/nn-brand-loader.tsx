/**
 * Inline loading indicator — three dots using semantic brand; for buttons, cards, and empty shells.
 */
export function NnBrandLoader({
  label = "Loading",
  className = "",
}: {
  /** Announced to assistive tech */
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={`nn-brand-loader inline-flex items-center gap-1 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="nn-brand-loader__dot" />
      <span className="nn-brand-loader__dot" />
      <span className="nn-brand-loader__dot" />
    </span>
  );
}
