/**
 * RelatedContentBlock — reusable internal-linking UI component.
 *
 * Server component. Accepts a LinkContext, calls the resolver, and renders
 * a clean, theme-consistent block of related content links.
 *
 * Supports:
 * - blog surfaces (lessons + questions + flashcards + related blogs)
 * - lesson surfaces (flashcards + questions + related lessons)
 * - question surfaces (lesson review + flashcards)
 * - cat_result surfaces (recommended lessons + practice)
 *
 * Renders nothing if no candidates are found, so it is safe to include
 * unconditionally on any page.
 */

import Link from "next/link";
import { resolveLinks } from "@/lib/linking/link-resolver";
import type { LinkContext, LinkCandidate, LinkTargetKind } from "@/lib/linking/internal-link-types";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  context: LinkContext;
  /**
   * Override which kinds to show and in what order.
   * Default per surface:
   *   blog      → ["lesson", "question", "flashcard", "blog"]
   *   lesson    → ["flashcard", "question", "lesson"]
   *   flashcard → ["lesson", "question"]
   *   question  → ["lesson", "flashcard"]
   *   cat_result → ["lesson", "flashcard", "question"]
   *   hub       → ["lesson", "question"]
   */
  showKinds?: LinkTargetKind[];
  /** Optional heading override for the section. */
  heading?: string;
  /** Render a compact inline list instead of the full block. */
  compact?: boolean;
};

// ── Labels ────────────────────────────────────────────────────────────────────

const KIND_LABELS: Record<LinkTargetKind, string> = {
  lesson:    "Related Lessons",
  flashcard: "Study Flashcards",
  question:  "Practice Questions",
  blog:      "Related Articles",
  cat:       "Check Your Readiness",
  hub:       "Explore",
};

const KIND_ICONS: Record<LinkTargetKind, string> = {
  lesson:    "📖",
  flashcard: "🗂",
  question:  "✏️",
  blog:      "📝",
  cat:       "📊",
  hub:       "🔗",
};

const DEFAULT_KINDS_FOR_SURFACE: Record<string, LinkTargetKind[]> = {
  blog:       ["lesson", "question", "flashcard", "blog"],
  lesson:     ["flashcard", "question", "lesson"],
  flashcard:  ["lesson", "question"],
  question:   ["lesson", "flashcard"],
  cat_result: ["lesson", "flashcard", "question"],
  hub:        ["lesson", "question"],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function LinkItem({ candidate }: { candidate: LinkCandidate }) {
  return (
    <li>
      <Link
        href={candidate.href}
        className="text-[var(--theme-link-text)] hover:underline text-sm leading-snug"
      >
        {candidate.anchorText}
      </Link>
    </li>
  );
}

function KindSection({
  kind,
  candidates,
}: {
  kind: LinkTargetKind;
  candidates: LinkCandidate[];
}) {
  if (candidates.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
        <span aria-hidden="true">{KIND_ICONS[kind]}</span>
        {KIND_LABELS[kind]}
      </h3>
      <ul className="space-y-1 pl-1 text-sm text-[var(--theme-body-text)]">
        {candidates.map((c) => (
          <LinkItem key={c.href} candidate={c} />
        ))}
      </ul>
    </div>
  );
}

function CompactLinkList({ candidates }: { candidates: LinkCandidate[] }) {
  if (candidates.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {candidates.map((c) => (
        <li key={c.href}>
          <Link
            href={c.href}
            className="text-[var(--theme-link-text)] hover:underline"
          >
            {c.anchorText}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function RelatedContentBlock({ context, showKinds, heading, compact = false }: Props) {
  const resolved = resolveLinks(context);

  const kindsToShow: LinkTargetKind[] =
    showKinds ?? DEFAULT_KINDS_FOR_SURFACE[context.surface] ?? ["lesson", "question"];

  // Collect all candidates in display order
  const allCandidates = kindsToShow.flatMap((k) => {
    switch (k) {
      case "lesson":    return resolved.lessons;
      case "flashcard": return resolved.flashcards;
      case "question":  return resolved.questions;
      case "blog":      return resolved.blogs;
      case "cat":       return resolved.cat;
      default:          return [];
    }
  });

  if (allCandidates.length === 0) return null;

  if (compact) {
    return (
      <nav aria-label="Related content">
        <CompactLinkList candidates={allCandidates} />
      </nav>
    );
  }

  const activeKinds = kindsToShow.filter((k) => {
    switch (k) {
      case "lesson":    return resolved.lessons.length > 0;
      case "flashcard": return resolved.flashcards.length > 0;
      case "question":  return resolved.questions.length > 0;
      case "blog":      return resolved.blogs.length > 0;
      case "cat":       return resolved.cat.length > 0;
      default:          return false;
    }
  });

  if (activeKinds.length === 0) return null;

  return (
    <aside
      aria-label="Related study resources"
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-4 sm:p-5"
    >
      {heading && (
        <h2 className="mb-3 text-sm font-semibold text-[var(--theme-body-text)]">
          {heading}
        </h2>
      )}
      <div className={`grid gap-4 ${activeKinds.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {activeKinds.map((kind) => {
          const candidates = (() => {
            switch (kind) {
              case "lesson":    return resolved.lessons;
              case "flashcard": return resolved.flashcards;
              case "question":  return resolved.questions;
              case "blog":      return resolved.blogs;
              case "cat":       return resolved.cat;
              default:          return [];
            }
          })();
          return <KindSection key={kind} kind={kind} candidates={candidates} />;
        })}
      </div>
    </aside>
  );
}

// ── Specialized variants ──────────────────────────────────────────────────────

/**
 * Inline "what to study next" strip for bottom of blog posts.
 * Shows a compact set of action-oriented links.
 */
export function BlogStudyNextStrip({ context }: { context: LinkContext }) {
  const resolved = resolveLinks({ ...context, surface: "blog" });

  const topLesson    = resolved.lessons[0];
  const topQuestion  = resolved.questions[0];
  const topFlashcard = resolved.flashcards[0];

  const items = [topLesson, topQuestion, topFlashcard].filter(Boolean) as LinkCandidate[];
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-warm)] px-4 py-3 text-sm">
      <span className="font-medium text-[var(--theme-body-text)]">Study next:</span>
      {items.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="font-medium text-[var(--theme-link-text)] hover:underline"
        >
          {c.anchorText}
        </Link>
      ))}
    </div>
  );
}

/**
 * "What to do next" block for CAT result pages, surfacing weak-area resources.
 * Pass a list of weak topicKeys for personalised recommendations.
 */
export function CatResultRecommendations({
  weakTopicKeys,
  locale,
  pathway,
}: {
  weakTopicKeys: string[];
  locale?: string;
  pathway?: LinkContext["pathway"];
}) {
  if (weakTopicKeys.length === 0) return null;

  // Resolve per weak topic, collect top candidates
  const allLessons: LinkCandidate[] = [];
  const allFlashcards: LinkCandidate[] = [];
  const allQuestions: LinkCandidate[] = [];

  for (const topicKey of weakTopicKeys.slice(0, 3)) {
    const resolved = resolveLinks({
      surface: "cat_result",
      locale,
      pathway,
      topicKey,
    });
    allLessons.push(...resolved.lessons.slice(0, 2));
    allFlashcards.push(...resolved.flashcards.slice(0, 1));
    allQuestions.push(...resolved.questions.slice(0, 1));
  }

  // Deduplicate by href
  const dedupe = (items: LinkCandidate[]): LinkCandidate[] => {
    const seen = new Set<string>();
    return items.filter((i) => {
      if (seen.has(i.href)) return false;
      seen.add(i.href);
      return true;
    });
  };

  const lessons    = dedupe(allLessons).slice(0, 4);
  const flashcards = dedupe(allFlashcards).slice(0, 2);
  const questions  = dedupe(allQuestions).slice(0, 2);

  if (!lessons.length && !flashcards.length && !questions.length) return null;

  return (
    <aside
      aria-label="Recommended study resources"
      className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-positive)] p-5"
    >
      <h2 className="mb-3 text-sm font-semibold text-[var(--theme-body-text)]">
        Recommended based on your results
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {lessons.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              📖 Review Lessons
            </h3>
            <ul className="space-y-1 text-sm">
              {lessons.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-[var(--theme-link-text)] hover:underline">
                    {c.anchorText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {flashcards.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              🗂 Flashcards
            </h3>
            <ul className="space-y-1 text-sm">
              {flashcards.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-[var(--theme-link-text)] hover:underline">
                    {c.anchorText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {questions.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              ✏️ Practice Questions
            </h3>
            <ul className="space-y-1 text-sm">
              {questions.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-[var(--theme-link-text)] hover:underline">
                    {c.anchorText}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
