import type { ReactNode } from "react";
import { BookMarked, Brain, Clock3, Target, Zap } from "lucide-react";
import type { MarketingPathwayLessonQuickReviewClientProps } from "@/lib/lessons/marketing-pathway-lesson-client-contract";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

type SectionProps = {
  title: string;
  subtitle?: string;
  accent: "success" | "info" | "warning" | "brand";
  children: ReactNode;
};

function railSectionAccentClass(accent: SectionProps["accent"]): string {
  switch (accent) {
    case "success":
      return "nn-premium-rail-section nn-premium-rail-section--success";
    case "info":
      return "nn-premium-rail-section nn-premium-rail-section--info";
    case "warning":
      return "nn-premium-rail-section nn-premium-rail-section--warning";
    default:
      return "nn-premium-rail-section nn-premium-rail-section--brand";
  }
}

function RailSection({ title, subtitle, accent, children }: SectionProps) {
  return (
    <section className={["rounded-lg border p-3 sm:p-3.5", railSectionAccentClass(accent)].join(" ")}>
      <h2 className="text-sm font-semibold tracking-tight text-[var(--theme-heading-text)]">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">{subtitle}</p> : null}
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

/** Drops stray `**` markers when authors/editors leave unbalanced emphasis (shows raw otherwise). */
function normalizeBulletMarkdownLine(raw: string): string {
  const count = (raw.match(/\*\*/g) ?? []).length;
  if (count % 2 !== 0) {
    return raw.replace(/\*\*/g, "");
  }
  return raw;
}

/** Renders lightweight `**bold**` / `*italic*` from pathway summaries without a full markdown runtime. */
function RailBulletLine({ text }: { text: string }) {
  const normalized = normalizeBulletMarkdownLine(text.trim());
  const parts = normalized.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) {
          return (
            <strong key={`b-${i}-${part.slice(0, 12)}`} className="font-semibold text-[var(--theme-heading-text)]">
              {bold[1]}
            </strong>
          );
        }
        const italic = /^\*([^*]+)\*$/.exec(part);
        if (italic) {
          return (
            <em key={`i-${i}-${part.slice(0, 12)}`} className="italic text-[var(--theme-body-text)]">
              {italic[1]}
            </em>
          );
        }
        return <span key={`t-${i}-${part.slice(0, 12)}`}>{part}</span>;
      })}
    </>
  );
}

function BulletList({ lines }: { lines: readonly string[] }) {
  if (lines.length === 0) return null;
  return (
    <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-[var(--theme-body-text)] [overflow-wrap:anywhere]">
      {lines.map((line, i) => (
        <li key={`${i}-${line.slice(0, 24)}`}>
          <RailBulletLine text={line} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Context utilities rail. Quick clinical summary belongs at the bottom of the lesson page;
 * this rail stays compact and action-oriented.
 */
export function PathwayLessonStudyRail({
  quickReviewLines,
  examFocusLines,
  commonMistakes,
  fullAccess,
  relatedQuestionsSlot,
  progressSummary,
}: MarketingPathwayLessonQuickReviewClientProps & {
  examFocusLines: readonly string[];
  commonMistakes?: readonly string[] | null;
  fullAccess: boolean;
  /** Suspense boundary for related stems — keeps initial HTML light. */
  relatedQuestionsSlot?: ReactNode;
  /** Optional signed-in progress line — does not block the main article when omitted. */
  progressSummary?: { status: PathwayLessonProgressStatus; label: string } | null;
}) {
  const focus = [...examFocusLines].filter(Boolean).slice(0, 6);
  const traps = fullAccess ? (commonMistakes ?? []).filter(Boolean).slice(0, 6) : [];

  const hasStatic =
    focus.length > 0 || traps.length > 0 || Boolean(progressSummary?.label) || quickReviewLines.length > 0;
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
    <div className="nn-lesson-utilities-rail space-y-3" data-nn-lesson-study-rail>
      {progressSummary?.label ? (
        <RailSection title="Study progress" subtitle={`Status: ${progressSummary.status.replace(/_/g, " ")}`} accent="brand">
          <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">{progressSummary.label}</p>
        </RailSection>
      ) : null}

      <section className="nn-lesson-utility-card">
        <div className="nn-lesson-utility-card__row">
          <BookMarked className="h-4 w-4" aria-hidden />
          <div>
            <h2>Saved lesson</h2>
            <p>Bookmark from the action bar.</p>
          </div>
        </div>
      </section>

      <section className="nn-lesson-utility-card">
        <div className="nn-lesson-utility-card__row">
          <Clock3 className="h-4 w-4" aria-hidden />
          <div>
            <h2>Study time</h2>
            <p>{quickReviewLines.length >= 8 ? "12-18 min focused read" : "8-12 min focused read"}</p>
          </div>
        </div>
      </section>

      <section className="nn-lesson-utility-card">
        <div className="nn-lesson-utility-card__row">
          <Brain className="h-4 w-4" aria-hidden />
          <div>
            <h2>Quick recall</h2>
            <p>Toggle recall prompts in the lesson body.</p>
          </div>
        </div>
      </section>

      {focus.length > 0 ? (
        <RailSection
          title="Exam readiness"
          subtitle="How this topic usually tests."
          accent="info"
        >
          <BulletList lines={focus} />
        </RailSection>
      ) : null}

      {traps.length > 0 ? (
        <RailSection
          title="Reinforcement status"
          subtitle="Traps to sidestep."
          accent="warning"
        >
          <BulletList lines={traps} />
        </RailSection>
      ) : null}

      <section className="nn-lesson-utility-card nn-lesson-utility-card--accent">
        <div className="nn-lesson-utility-card__row">
          <Target className="h-4 w-4" aria-hidden />
          <div>
            <h2>Related practice</h2>
            <p>Use the practice links after the rapid review.</p>
          </div>
          <Zap className="ml-auto h-3.5 w-3.5 opacity-60" aria-hidden />
        </div>
      </section>

      {relatedQuestionsSlot ? <div className="hidden xl:block">{relatedQuestionsSlot}</div> : null}
    </div>
  );
}
