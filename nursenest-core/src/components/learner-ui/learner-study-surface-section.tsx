import type { ReactNode } from "react";
import { LearnerSurface } from "@/components/learner-ui/learner-surface";
import type { LearnerSurfaceTone } from "@/components/learner-ui/learner-surface-tone";

/**
 * Full-width study section: `nn-dash-section` rhythm + tinted {@link LearnerSurface} + kicker header.
 * Prefer this over ad-hoc rounded borders on `/app` study pages.
 */
export function LearnerStudySurfaceSection({
  id,
  eyebrow,
  title,
  intro,
  tone,
  className = "",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string | null;
  tone: LearnerSurfaceTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`nn-dash-section ${className}`.trim()}>
      <LearnerSurface tone={tone} padding="lg" className="flex flex-col gap-5">
        <header className="nn-ls-section-head max-w-3xl">
          <p className="nn-ls-kicker">{eyebrow}</p>
          <h2 id={`${id}-heading`} className="nn-ls-title">
            {title}
          </h2>
          {intro ? <p className="nn-ls-intro">{intro}</p> : null}
        </header>
        <div className="flex flex-col gap-5">{children}</div>
      </LearnerSurface>
    </section>
  );
}
