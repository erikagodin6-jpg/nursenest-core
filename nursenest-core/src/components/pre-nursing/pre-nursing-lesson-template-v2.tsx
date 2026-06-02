"use client";

/**
 * ## Legacy pre-nursing module blueprint (source: `client/src/pages/pre-nursing.tsx`, active module branch ~L1211–1332)
 *
 * Vertical order restored for pedagogy + scan rhythm:
 *
 * 1. **Toolbar row** (handled on Next route: back link, milestone strip — outside this template)
 * 2. **Intro / overview** — regional overlay prose + key concepts (when present)
 * 3. **Supplemental content** — optional admin-authored paragraphs from `/api/lesson-overrides/prenursing-{slug}`
 * 4. **Core module body** — interactive TSX modules (`content/pre-nursing/modules/*`)
 * 5. **Deep-dive / wrap-up** — overlay nursing responsibilities, clinical pearls, patient education, takeaways
 * 6. **Capstone assessment** — legacy “Pre-nursing comprehensive review” self-check quiz after the module
 *
 * Spacing: section stacks use `space-y-*` + `nn-lesson-article-section` where a lesson rhythm applies.
 * Two-column: {@link PreNursingLessonSplit} for explanation + visual (md+), single column on small screens.
 */

import { useEffect, useState, type ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { SelfCheckQuiz } from "@/components/pre-nursing/interactive-learning";
import { PRE_NURSING_COMPREHENSIVE_REVIEW_QUIZ } from "@/content/pre-nursing/pre-nursing-comprehensive-review-quiz";
import type { PreNursingModuleOverlay } from "@/lib/i18n/pre-nursing-overlay-types";

const CAPSTONE_TITLE = "Pre-nursing comprehensive review";

function PreNursingSupplementalStrip({ moduleSlug }: { moduleSlug: string }) {
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`/api/lesson-overrides/prenursing-${moduleSlug}`);
        if (!res.ok) return;
        const data = (await res.json()) as { supplementalContent?: string[] };
        if (!cancelled && Array.isArray(data?.supplementalContent) && data.supplementalContent.length > 0) {
          setParagraphs(data.supplementalContent);
        }
      } catch {
        /* monolith route may be absent in some deploys — non-fatal */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [moduleSlug]);

  if (paragraphs.length === 0) return null;

  return (
    <section
      className="nn-lesson-article-section nn-card mb-8 border border-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,transparent)] px-4 py-5 sm:px-5"
      aria-label="Supplemental overview"
      data-testid={`pre-nursing-supplemental-${moduleSlug}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
        <span className="text-sm font-semibold text-[var(--semantic-brand)]">Supplemental content</span>
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
        {paragraphs.map((p, idx) => {
          const isHtml = /<[a-z][\s\S]*>/i.test(p);
          return isHtml ? (
            <div
              key={idx}
              className="prose prose-sm max-w-none text-[var(--theme-body-text)]"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ) : (
            <p key={idx}>{p}</p>
          );
        })}
      </div>
    </section>
  );
}

function OverlayIntro({ overlay }: { overlay: PreNursingModuleOverlay }) {
  if (!overlay.overview && (!overlay.key_concepts || overlay.key_concepts.length === 0)) return null;
  return (
    <header className="nn-lesson-article-section mx-auto max-w-4xl px-4 pb-2 pt-2 sm:px-6 lg:px-8">
      {overlay.overview ? (
        <p className="mb-4 text-base leading-7 text-[var(--semantic-text-secondary)]">{overlay.overview}</p>
      ) : null}
      {overlay.key_concepts && overlay.key_concepts.length > 0 ? (
        <div className="nn-card border-border bg-[var(--theme-muted-surface)] px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Key concepts</p>
          <ul className="list-inside list-disc space-y-1.5 text-sm text-[var(--semantic-text-secondary)]">
            {overlay.key_concepts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}

function OverlayFooter({ overlay }: { overlay: PreNursingModuleOverlay }) {
  const hasContent =
    overlay.nursing_responsibilities ||
    overlay.clinical_pearls ||
    overlay.patient_education ||
    (overlay.key_takeaways && overlay.key_takeaways.length > 0);
  if (!hasContent) return null;
  return (
    <footer className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {overlay.nursing_responsibilities ? (
        <section className="nn-lesson-article-section">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            Nursing responsibilities
          </h3>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{overlay.nursing_responsibilities}</p>
        </section>
      ) : null}
      {overlay.clinical_pearls ? (
        <section className="nn-lesson-article-section rounded-xl border-l-4 border-[var(--semantic-info)] bg-[var(--semantic-panel-cool)] px-4 py-3">
          <h3 className="mb-1 text-sm font-semibold text-[var(--semantic-info-contrast)]">Clinical pearls</h3>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{overlay.clinical_pearls}</p>
        </section>
      ) : null}
      {overlay.patient_education ? (
        <section className="nn-lesson-article-section">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
            Patient education
          </h3>
          <p className="text-sm leading-6 text-[var(--semantic-text-secondary)]">{overlay.patient_education}</p>
        </section>
      ) : null}
      {overlay.key_takeaways && overlay.key_takeaways.length > 0 ? (
        <section className="nn-lesson-article-section rounded-xl bg-[var(--semantic-panel-positive)] px-4 py-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--semantic-success-contrast)]">Key takeaways</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {overlay.key_takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </footer>
  );
}

/**
 * Responsive two-column band: primary explanation + supporting visual (image, diagram, card).
 * Collapses to a single column below `md`.
 */
export function PreNursingLessonSplit({
  primary,
  supporting,
  supportingLabel = "Visual reference",
}: {
  primary: ReactNode;
  supporting: ReactNode;
  /** Accessible name for the aside column */
  supportingLabel?: string;
}) {
  return (
    <div className="nn-lesson-article-section grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start md:gap-8">
      <div className="min-w-0 space-y-3 text-[var(--theme-body-text)]">{primary}</div>
      <aside className="min-w-0" aria-label={supportingLabel}>
        {supporting}
      </aside>
    </div>
  );
}

export type PreNursingLessonTemplateV2Props = {
  moduleSlug: string;
  moduleOverlay?: PreNursingModuleOverlay | null;
  children: ReactNode;
};

/**
 * Legacy-ordered shell for free pre-nursing modules on Next.js.
 * Does not alter module TSX bodies; adds supplemental + capstone layers from the Vite-era flow.
 *
 * Paywall: pre-nursing catalog remains free; this template does not expose hidden overlay fields —
 * when `moduleOverlay` is absent, only the module body + capstone render.
 */
export function PreNursingLessonTemplateV2({ moduleSlug, moduleOverlay = null, children }: PreNursingLessonTemplateV2Props) {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-10 sm:px-6 lg:px-8">
      {moduleOverlay ? <OverlayIntro overlay={moduleOverlay} /> : null}

      <PreNursingSupplementalStrip moduleSlug={moduleSlug} />

      <div className="space-y-10">{children}</div>

      {moduleOverlay ? <OverlayFooter overlay={moduleOverlay} /> : null}

      <section className="nn-lesson-article-section mt-12 border-t border-[var(--semantic-border-soft)] pt-8" aria-label={CAPSTONE_TITLE}>
        <SelfCheckQuiz title={CAPSTONE_TITLE} questions={PRE_NURSING_COMPREHENSIVE_REVIEW_QUIZ} />
      </section>
    </div>
  );
}
