import Link from "next/link";
import {
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { PathwayLessonRecordChips } from "@/components/pathway-lessons/pathway-lesson-record-chips";
import { nclexRnLessonExamPreview, type NclexRnHubRegion } from "@/lib/lessons/nclex-rn-us-lesson-enrichment";
import {
  nclexPnLessonExamPreview,
  type NclexPnLessonPreviewFraming,
} from "@/lib/lessons/nclex-pn-us-lesson-enrichment";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

/** Above this count per Client Needs section, show a compact link list first and tuck rich previews behind a disclosure. */
export const NCLEX_HUB_RICH_PREVIEWS_COLLAPSE_AFTER = 5;

type SectionShape = {
  anchor: string;
  title: string;
  subtitle: string;
  count: number;
  lessons: PathwayLessonRecord[];
};

type Props = {
  pathwayId: string;
  lessonsBasePath: string;
  section: SectionShape;
  featuredSlug: string | null | undefined;
  variant: "rn" | "pn";
  /** When variant is PN (US NCLEX-PN vs Canada REx-PN), used in exam-specific copy only. */
  pnExamShortLabel?: string;
  pnPreviewFraming?: NclexPnLessonPreviewFraming;
  rnRegion?: NclexRnHubRegion;
  progressMap?: Record<string, PathwayLessonProgressStatus>;
};

export function PathwayNclexScalableLessonSection({
  pathwayId,
  lessonsBasePath,
  section,
  featuredSlug,
  variant,
  pnExamShortLabel = "NCLEX-PN",
  pnPreviewFraming = "nclex-pn-us",
  rnRegion = "us",
  progressMap = {},
}: Props) {
  if (section.count === 0) return null;

  const pathwayDef = getExamPathwayById(pathwayId);
  const catHubHref = pathwayDef ? buildExamPathwayPath(pathwayDef, "cat") : null;

  const display = section.lessons.filter((l) => !featuredSlug || l.slug !== featuredSlug);
  const useCollapsedRich = display.length > NCLEX_HUB_RICH_PREVIEWS_COLLAPSE_AFTER;

  const richCard = (l: PathwayLessonRecord) => {
    const p =
      variant === "rn"
        ? nclexRnLessonExamPreview(l, rnRegion)
        : nclexPnLessonExamPreview(l, pnPreviewFraming);
    const showProgress = Object.keys(progressMap).length > 0;
    return (
      <li
        key={l.slug}
        className="nn-study-card nn-study-card--wash nn-student-card-lift p-4 transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-card-hover)] sm:p-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <PathwayLessonRecordChips lesson={l} className="min-w-0 flex-1" />
          {showProgress ? <PathwayLessonProgressBadge status={progressMap[l.slug] ?? "not_started"} /> : null}
        </div>
        <Link
          href={pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug)!}
          className="mt-1 block text-lg font-semibold leading-snug text-[var(--theme-heading-text)] underline-offset-4 transition hover:text-primary hover:underline"
        >
          {l.title}
        </Link>
        <div className="mt-4 grid gap-3 border-t border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] pt-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--theme-muted-text)]">Scenario focus</p>
            <p className="mt-0.5">{p.scenarioType}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--theme-muted-text)]">
              {variant === "rn" ? "Likely NCLEX item types" : "Likely item types"}
            </p>
            <p className="mt-0.5">{p.examQuestionTypes}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase text-[var(--theme-muted-text)]">
              {variant === "rn"
                ? "What this lesson prepares you for"
                : `Why it matters on ${pnExamShortLabel}`}
            </p>
            <p className="mt-0.5 text-[var(--theme-muted-text)]">{p.whyOnExam}</p>
          </div>
          <div className="nn-surface-inset sm:col-span-2 p-3">
            <p className="text-xs font-semibold text-[var(--theme-muted-text)]">{variant === "rn" ? "Clinical scenario preview" : "Clinical preview"}</p>
            <p className="mt-1 text-[var(--theme-body-text)]">{p.miniScenario}</p>
          </div>
          <div className="nn-surface-inset sm:col-span-2 p-3">
            <p className="text-xs font-semibold text-[var(--theme-muted-text)]">{variant === "rn" ? "Reasoning snippet" : "Rationale snippet"}</p>
            <p className="mt-1 italic text-[var(--theme-muted-text)]">&ldquo;{p.rationaleSnippet}&rdquo;</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug)!}
            className="text-sm font-semibold text-primary"
          >
            Read lesson →
          </Link>
          <Link href={pathwayHubAppQuestionsHref(pathwayId, l.topic)} className="text-sm font-semibold text-primary">
            Practice questions →
          </Link>
          <Link href="/flashcards" className="text-sm font-semibold text-muted hover:text-primary">
            Flashcards →
          </Link>
          {catHubHref ? (
            <Link href={catHubHref} className="text-sm font-semibold text-muted hover:text-primary">
              CAT prep →
            </Link>
          ) : null}
        </div>
      </li>
    );
  };

  return (
    <section id={section.anchor} className="scroll-mt-24">
      <div className="border-b border-[var(--border-subtle)] pb-3">
        <h2 className="text-xl font-bold text-[var(--theme-heading-text)]">{section.title}</h2>
        {section.subtitle && (
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            {section.subtitle} · <span className="font-medium text-foreground">{section.count} lesson(s) on this page</span>
          </p>
        )}
      </div>

      {useCollapsedRich ? (
        <>
          <ul className="mt-4 space-y-2">
            {display.map((l) => {
              const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
              if (!href) return null;
              const showProgress = Object.keys(progressMap).length > 0;
              return (
                <li
                  key={l.slug}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 shadow-[var(--semantic-shadow-soft)] transition-[box-shadow,transform] duration-200 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="min-w-0">
                    <PathwayLessonRecordChips lesson={l} omitTopic className="mb-1" />
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--theme-muted-text)]">{l.topic}</p>
                    <Link href={href} className="block truncate text-sm font-semibold text-primary hover:underline sm:text-base">
                      {l.title}
                    </Link>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {showProgress ? (
                      <PathwayLessonProgressBadge status={progressMap[l.slug] ?? "not_started"} />
                    ) : null}
                    <Link
                      href={pathwayHubAppQuestionsHref(pathwayId, l.topic)}
                      className="shrink-0 text-xs font-medium text-muted hover:text-primary"
                    >
                      Questions →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
          <details className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[color-mix(in_srgb,var(--theme-muted-surface)_55%,var(--bg-card))] shadow-[var(--shadow-card)]">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
              <span className="underline-offset-2">Exam previews & clinical context — expand (optional)</span>
            </summary>
            <ul className="space-y-6 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]/80 px-3 py-4 sm:px-4">{display.map((l) => richCard(l))}</ul>
          </details>
        </>
      ) : (
        <ul className="mt-6 space-y-6">{display.map((l) => richCard(l))}</ul>
      )}

      {display.length === 0 && section.lessons.length > 0 && (
        <p className="mt-4 text-sm text-[var(--theme-muted-text)]">
          This category&apos;s lesson is expanded in the featured block above.
        </p>
      )}
    </section>
  );
}
