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
  surfacePadding = "lg",
  className = "",
  children,
}: {
  id: string;
  /** Omit or pass null to hide the kicker line (quieter section chrome). */
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  tone: LearnerSurfaceTone;
  /** Dashboard sections often read better with `md` padding. */
  surfacePadding?: "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`nn-dash-section ${className}`.trim()}>
      <LearnerSurface tone={tone} padding={surfacePadding} className="flex flex-col gap-4 sm:gap-5">
        <header className="nn-ls-section-head max-w-3xl">
          {eyebrow ? <p className="nn-ls-kicker">{eyebrow}</p> : null}
          <h2 id={`${id}-heading`} className={eyebrow ? "nn-ls-title" : "nn-ls-title nn-ls-title--flush"}>
            {title}
          </h2>
          {intro ? <p className="nn-ls-intro">{intro}</p> : null}
        </header>
        <div className="flex flex-col gap-4 sm:gap-5">{children}</div>
      </LearnerSurface>
    </section>
  );
}
