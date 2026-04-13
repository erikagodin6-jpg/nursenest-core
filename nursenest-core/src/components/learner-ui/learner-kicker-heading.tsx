import type { ReactNode } from "react";

/**
 * Lightweight section title stack (kicker + title + intro) without a full {@link LearnerSurface}.
 * Use inside `nn-dash-section` or atop {@link ProductCard} children.
 */
export function LearnerKickerHeading({
  kicker,
  title,
  intro,
  id,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Optional `id` for the heading element (e.g. `aria-labelledby`). */
  id?: string;
}) {
  return (
    <header className="nn-ls-section-head max-w-3xl">
      <p className="nn-ls-kicker">{kicker}</p>
      <h2 id={id} className="nn-ls-title">
        {title}
      </h2>
      {intro ? <div className="nn-ls-intro">{intro}</div> : null}
    </header>
  );
}
