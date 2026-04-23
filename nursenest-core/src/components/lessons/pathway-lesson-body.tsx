import type { ReactNode } from "react";
import Link from "next/link";
import type { TierCode } from "@prisma/client";
import { AlertTriangle, ClipboardList, ListOrdered } from "lucide-react";
import type {
  PathwayLessonExamFocus,
  PathwayLessonFigure,
  PathwayLessonSectionKind,
} from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonFigures } from "@/components/lessons/pathway-lesson-figures";
import { resolveTierBlocksForViewer } from "@/lib/lessons/tier-block-content";
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { lessonBodyPresentationClass } from "@/lib/ui/lesson-body-presentation";

/** Markdown-style internal links: `LESSON:slug` wiki or root-relative `/path`. */
const MD_INTERNAL_LINK = /(\[[^\]]+\]\((?:LESSON:[^)]+|\/[^)]+)\))/g;

function inlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderParagraphWithLinks(
  paragraph: string,
  lessonWikiBasePath: string | null | undefined,
  keyPrefix: string,
): ReactNode {
  const parts = paragraph.split(MD_INTERNAL_LINK).filter((p) => p.length > 0);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\((LESSON:[^)]+|\/[^)]+)\)$/);
    if (m) {
      const label = m[1];
      const target = m[2];
      if (target.startsWith("LESSON:")) {
        const slug = target.slice("LESSON:".length).trim();
        const base = lessonWikiBasePath?.replace(/\/$/, "");
        if (!base) {
          return (
            <span key={`${keyPrefix}-l-${i}`} className="font-normal">
              {inlineBold(label)}
            </span>
          );
        }
        const href = `${base}/${encodeURIComponent(slug)}`;
        return (
          <Link
            key={`${keyPrefix}-l-${i}`}
            href={href}
            className="font-normal text-primary underline decoration-primary/35 underline-offset-[3px] hover:decoration-primary"
          >
            {inlineBold(label)}
          </Link>
        );
      }
      return (
        <Link
          key={`${keyPrefix}-l-${i}`}
          href={target}
          className="font-normal text-primary underline decoration-primary/35 underline-offset-[3px] hover:decoration-primary"
        >
          {inlineBold(label)}
        </Link>
      );
    }
    return <span key={`${keyPrefix}-t-${i}`}>{inlineBold(part)}</span>;
  });
}

/** Resolved paragraph strings after tier + measurement transforms (used for layout / empty detection). */
export function pathwayLessonResolvedParagraphs(
  text: string,
  opts?: {
    viewerTier?: TierCode | null;
    measurementSystem?: MeasurementSystem | null;
    measurementDual?: boolean;
    /** When `tier_specific_relevance`, TierBlocks unwrap in strict single-lane mode (no PN/RN/NP cross-leak). */
    sectionKind?: PathwayLessonSectionKind | null;
  },
): string[] {
  const raw = typeof text === "string" ? text : "";
  const tierMode = opts?.sectionKind === "tier_specific_relevance" ? "strict_single" : "ladder";
  let safe = resolveTierBlocksForViewer(raw, opts?.viewerTier, tierMode);
  if (opts?.measurementSystem != null) {
    safe = resolveMeasurementTokens(safe, opts.measurementSystem, { dual: opts.measurementDual === true });
  }
  return safe.split(/\n\n/).filter((p) => p.trim().length > 0);
}

function pathwayLessonExamFocusHasStructured(examFocus?: PathwayLessonExamFocus | null): boolean {
  return Boolean(
    examFocus &&
      (examFocus.howTested?.trim() ||
        examFocus.commonTraps?.trim() ||
        examFocus.prioritizationCues?.trim()),
  );
}

function LearnerSparsePanel({ children }: { children: ReactNode }) {
  return <div className="lv-lesson-sparse-panel">{children}</div>;
}

function PathwayLessonExamFocusInlineBlocks({
  examFocus,
  viewerTier,
  measurementSystem,
  measurementDual,
}: {
  examFocus: PathwayLessonExamFocus;
  viewerTier?: TierCode | null;
  measurementSystem?: MeasurementSystem | null;
  measurementDual?: boolean;
}) {
  type ExamFocusBlockKey = "how-tested" | "traps" | "priorities";
  const blocks: { key: ExamFocusBlockKey; title: string; text: string; Icon: typeof ListOrdered }[] = [];
  if (examFocus.howTested?.trim()) {
    blocks.push({
      key: "how-tested",
      title: "How this concept is tested",
      text: examFocus.howTested,
      Icon: ListOrdered,
    });
  }
  if (examFocus.commonTraps?.trim()) {
    blocks.push({
      key: "traps",
      title: "Common traps",
      text: examFocus.commonTraps,
      Icon: AlertTriangle,
    });
  }
  if (examFocus.prioritizationCues?.trim()) {
    blocks.push({
      key: "priorities",
      title: "Prioritization cues",
      text: examFocus.prioritizationCues,
      Icon: ClipboardList,
    });
  }
  if (blocks.length === 0) return null;
  return (
    <div className="nn-lesson-exam-focus-inline" role="region" aria-label="Exam focus">
      {blocks.map((b) => (
        <article
          key={b.key}
          className="nn-lesson-exam-focus-inline__card"
          data-exam-focus-block={b.key}
        >
          <header className="nn-lesson-exam-focus-inline__head">
            <b.Icon className="nn-lesson-exam-focus-inline__icon" aria-hidden />
            <h3 className="nn-lesson-exam-focus-inline__title">{b.title}</h3>
          </header>
          <div className="nn-lesson-exam-focus-inline__body">
            <PathwayLessonBody
              text={b.text}
              viewerTier={viewerTier}
              measurementSystem={measurementSystem ?? undefined}
              measurementDual={measurementDual}
              compactProse
            />
          </div>
        </article>
      ))}
    </div>
  );
}

/**
 * Classifies a resolved paragraph block for HTML rendering (no full markdown parser).
 *
 * Patterns:
 *   "text" — regular prose
 *   "list" — every line starts with "- "
 *   "ordered-list" — every line starts with a decimal prefix like "1. ", "2. "
 *   "headed-list" — first line is prose; remaining lines are "- " bullets
 */
type ParagraphBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "ordered-list"; items: string[] }
  | { kind: "headed-list"; header: string; items: string[] };

function isBulletLine(line: string): boolean {
  return /^[ \t]*-\s+/.test(line);
}

function stripBullet(line: string): string {
  return line.replace(/^[ \t]*-\s+/, "");
}

function isNumberedLine(line: string): boolean {
  return /^[ \t]*\d+\.\s+/.test(line);
}

function stripNumberPrefix(line: string): string {
  return line.replace(/^[ \t]*\d+\.\s+/, "");
}

/** @internal Exported for contract tests. */
export function parseParagraphBlock(raw: string): ParagraphBlock {
  const p = raw.trim();
  const lines = p.split("\n");

  // Pure bullet list: every line starts with "- "
  if (lines.length > 0 && lines.every(isBulletLine)) {
    return { kind: "list", items: lines.map(stripBullet) };
  }

  // Pure numbered list: every line starts with "1. ", "2. ", …
  if (lines.length > 0 && lines.every(isNumberedLine)) {
    return { kind: "ordered-list", items: lines.map(stripNumberPrefix) };
  }

  // Labelled list: first line is a prose header; all remaining lines are bullets
  if (lines.length >= 2 && !isBulletLine(lines[0]) && lines.slice(1).every(isBulletLine)) {
    return {
      kind: "headed-list",
      header: lines[0],
      items: lines.slice(1).map(stripBullet),
    };
  }

  return { kind: "text", text: p };
}

export function PathwayLessonBody({
  text,
  lessonWikiBasePath,
  viewerTier,
  measurementSystem,
  measurementDual,
  sectionKind,
  compactProse,
  className,
}: {
  text: string;
  /** Base URL for `[label](LESSON:slug)` → `{base}/{slug}` (same hub as this lesson). */
  lessonWikiBasePath?: string | null;
  /** Filters `<TierBlock tier="…">` regions for the viewer ladder; omitted unwraps all tiers. */
  viewerTier?: TierCode | null;
  /** Resolves `{{measurement_token}}` placeholders to region-aware units. */
  measurementSystem?: MeasurementSystem | null;
  /** Show secondary unit in parentheses (e.g. dual US/SI). */
  measurementDual?: boolean;
  /** Adds `.nn-lesson-body--*` hooks paired with `LessonSectionCard` `data-lsc-kind`. */
  sectionKind?: PathwayLessonSectionKind | null;
  /** Tighter vertical rhythm for nested blocks (e.g. exam-focus mini-cards). */
  compactProse?: boolean;
  className?: string | null;
}) {
  const paragraphs = pathwayLessonResolvedParagraphs(text, {
    viewerTier,
    measurementSystem,
    measurementDual,
    sectionKind,
  });
  if (paragraphs.length === 0) {
    return null;
  }
  const presentation = lessonBodyPresentationClass(sectionKind);
  const rootClass = [
    "nn-lesson-content nn-lesson-prose",
    compactProse ? "space-y-3" : "space-y-5",
    presentation,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={rootClass}>
      {paragraphs.map((p, idx) => {
        const block = parseParagraphBlock(p);

        if (block.kind === "list") {
          return (
            <ul key={idx}>
              {block.items.map((item, i) => (
                <li key={i}>
                  {renderParagraphWithLinks(item, lessonWikiBasePath, `para-${idx}-li-${i}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.kind === "ordered-list") {
          return (
            <ol key={idx}>
              {block.items.map((item, i) => (
                <li key={i}>
                  {renderParagraphWithLinks(item, lessonWikiBasePath, `para-${idx}-oli-${i}`)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.kind === "headed-list") {
          return (
            <div key={idx}>
              <p className="whitespace-pre-wrap nn-lesson-list-header">
                {renderParagraphWithLinks(block.header, lessonWikiBasePath, `para-${idx}-h`)}
              </p>
              <ul className="mt-2">
                {block.items.map((item, i) => (
                  <li key={i}>
                    {renderParagraphWithLinks(item, lessonWikiBasePath, `para-${idx}-li-${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <p key={idx} className="whitespace-pre-wrap">
            {renderParagraphWithLinks(p.trim(), lessonWikiBasePath, `para-${idx}`)}
          </p>
        );
      })}
    </div>
  );
}

/** Section body plus optional structured figures (catalog / DB JSON). */
export function PathwayLessonSectionContent({
  text,
  figures,
  examFocus,
  lessonWikiBasePath,
  viewerTier,
  measurementSystem,
  measurementDual,
  sectionKind,
  emptyBodyMessage,
  figuresVisualLeadMessage,
}: {
  text: string;
  figures?: PathwayLessonFigure[] | undefined;
  examFocus?: PathwayLessonExamFocus | null;
  lessonWikiBasePath?: string | null;
  viewerTier?: TierCode | null;
  measurementSystem?: MeasurementSystem | null;
  measurementDual?: boolean;
  sectionKind?: PathwayLessonSectionKind | null;
  /** Shown when there is no prose, no exam-focus blocks, and no figures (subscriber lesson). */
  emptyBodyMessage: string;
  /** Short line when prose is empty but figures carry the teaching. */
  figuresVisualLeadMessage: string;
}) {
  const paragraphs = pathwayLessonResolvedParagraphs(text, {
    viewerTier,
    measurementSystem,
    measurementDual,
    sectionKind,
  });
  const hasFigures = Boolean(figures && figures.length > 0);
  const hasExamBlocks = pathwayLessonExamFocusHasStructured(examFocus);
  const bodyEl =
    paragraphs.length > 0 ? (
      <PathwayLessonBody
        text={text}
        lessonWikiBasePath={lessonWikiBasePath}
        viewerTier={viewerTier}
        measurementSystem={measurementSystem}
        measurementDual={measurementDual}
        sectionKind={sectionKind}
      />
    ) : null;
  const examEl =
    !bodyEl && hasExamBlocks && examFocus ? (
      <PathwayLessonExamFocusInlineBlocks
        examFocus={examFocus}
        viewerTier={viewerTier}
        measurementSystem={measurementSystem}
        measurementDual={measurementDual}
      />
    ) : null;
  const figuresEl = hasFigures ? <PathwayLessonFigures figures={figures!} /> : null;

  const showFiguresLead = !bodyEl && !examEl && hasFigures;
  const showEmptyPanel = !bodyEl && !examEl && !hasFigures;

  return (
    <div className="space-y-3">
      {bodyEl}
      {examEl}
      {showFiguresLead ? <LearnerSparsePanel>{figuresVisualLeadMessage}</LearnerSparsePanel> : null}
      {figuresEl}
      {showEmptyPanel ? <LearnerSparsePanel>{emptyBodyMessage}</LearnerSparsePanel> : null}
    </div>
  );
}
