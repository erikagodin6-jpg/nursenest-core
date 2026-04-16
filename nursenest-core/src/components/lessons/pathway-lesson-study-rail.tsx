import type { ReactNode } from "react";
import type { MarketingPathwayLessonQuickReviewClientProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";

type SectionProps = {
  title: string;
  subtitle?: string;
  accent: "success" | "info" | "warning" | "brand";
  children: ReactNode;
};

function RailSection({ title, subtitle, accent, children }: SectionProps) {
  const border =
    accent === "success"
      ? "color-mix(in srgb, var(--semantic-success) 28%, var(--semantic-border-soft))"
      : accent === "info"
        ? "color-mix(in srgb, var(--semantic-info) 28%, var(--semantic-border-soft))"
        : accent === "warning"
          ? "color-mix(in srgb, var(--semantic-warning) 28%, var(--semantic-border-soft))"
          : "color-mix(in srgb, var(--semantic-brand) 28%, var(--semantic-border-soft))";
  const bg =
    accent === "success"
      ? "color-mix(in srgb, var(--semantic-panel-positive) 55%, transparent)"
      : accent === "info"
        ? "color-mix(in srgb, var(--semantic-panel-cool) 50%, transparent)"
        : accent === "warning"
          ? "color-mix(in srgb, var(--semantic-panel-warm) 45%, transparent)"
          : "color-mix(in srgb, var(--semantic-chart-1) 12%, var(--theme-card-bg))";

  return (
    <section
      className="rounded-xl border p-3.5 sm:p-4"
      style={{ borderColor: border, background: bg }}
    >
      <h2 className="text-sm font-semibold tracking-tight text-[var(--theme-heading-text)]">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">{subtitle}</p> : null}
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function BulletList({ lines }: { lines: readonly string[] }) {
  if (lines.length === 0) return null;
  return (
    <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
      {lines.map((line, i) => (
        <li key={`${i}-${line.slice(0, 24)}`}>{line}</li>
      ))}
    </ul>
  );
}

/**
 * Scannable study rail: clinical summary, exam focus, common mistakes, and an optional slot for
 * streamed related-question links. Intended for `xl` sticky column; stacked above the article on smaller viewports.
 */
export function PathwayLessonStudyRail({
  quickReviewLines,
  examFocusLines,
  commonMistakes,
  fullAccess,
  relatedQuestionsSlot,
}: MarketingPathwayLessonQuickReviewClientProps & {
  examFocusLines: readonly string[];
  commonMistakes?: readonly string[] | null;
  fullAccess: boolean;
  /** Suspense boundary for related stems — keeps initial HTML light. */
  relatedQuestionsSlot?: ReactNode;
}) {
  const summary = [...quickReviewLines].filter(Boolean).slice(0, 10);
  const focus = [...examFocusLines].filter(Boolean).slice(0, 6);
  const traps = fullAccess ? (commonMistakes ?? []).filter(Boolean).slice(0, 6) : [];

  const hasStatic = summary.length > 0 || focus.length > 0 || traps.length > 0;
  if (!hasStatic && !relatedQuestionsSlot) return null;

  /** Wider screens: related stems stream into the rail; narrow viewports use the full-width block in the footer. */
  if (!hasStatic && relatedQuestionsSlot) {
    return (
      <div className="hidden xl:block" data-nn-lesson-study-rail>
        {relatedQuestionsSlot}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-nn-lesson-study-rail>
      {summary.length > 0 ? (
        <RailSection
          title="Quick clinical summary"
          subtitle="Skim before diving into the full lesson — same facts, tighter bullets."
          accent="success"
        >
          <BulletList lines={summary} />
        </RailSection>
      ) : null}

      {focus.length > 0 ? (
        <RailSection
          title="Exam focus (high-yield)"
          subtitle="How this topic tends to show up and what to prioritize."
          accent="info"
        >
          <BulletList lines={focus} />
        </RailSection>
      ) : null}

      {traps.length > 0 ? (
        <RailSection
          title="Common mistakes"
          subtitle="Typical distractors and unsafe pivots to watch for."
          accent="warning"
        >
          <BulletList lines={traps} />
        </RailSection>
      ) : null}

      {relatedQuestionsSlot ? <div className="hidden xl:block">{relatedQuestionsSlot}</div> : null}
    </div>
  );
}
