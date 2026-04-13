import type { ReactNode } from "react";
import Link from "next/link";
import type { TierCode } from "@prisma/client";
import type { PathwayLessonExamFocus, PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonFigures } from "@/components/lessons/pathway-lesson-figures";
import { resolveTierBlocksForViewer } from "@/lib/lessons/tier-block-content";
import type { MeasurementSystem } from "@/lib/measurements/measurement-system";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";

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
            <span key={`${keyPrefix}-l-${i}`} className="font-medium">
              {inlineBold(label)}
            </span>
          );
        }
        const href = `${base}/${encodeURIComponent(slug)}`;
        return (
          <Link
            key={`${keyPrefix}-l-${i}`}
            href={href}
            className="font-medium text-primary hover:underline"
          >
            {inlineBold(label)}
          </Link>
        );
      }
      return (
        <Link key={`${keyPrefix}-l-${i}`} href={target} className="font-medium text-primary hover:underline">
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
  },
): string[] {
  const raw = typeof text === "string" ? text : "";
  let safe = resolveTierBlocksForViewer(raw, opts?.viewerTier);
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
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm leading-relaxed"
      style={{
        borderColor: "color-mix(in srgb, var(--semantic-info) 32%, var(--semantic-border-soft))",
        background: "color-mix(in srgb, var(--semantic-panel-cool) 50%, transparent)",
        color: "var(--semantic-text-secondary)",
      }}
    >
      {children}
    </div>
  );
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
  const blocks: { title: string; text: string }[] = [];
  if (examFocus.howTested?.trim()) {
    blocks.push({ title: "How this concept is tested", text: examFocus.howTested });
  }
  if (examFocus.commonTraps?.trim()) {
    blocks.push({ title: "Common traps", text: examFocus.commonTraps });
  }
  if (examFocus.prioritizationCues?.trim()) {
    blocks.push({ title: "Prioritization cues", text: examFocus.prioritizationCues });
  }
  if (blocks.length === 0) return null;
  return (
    <div className="space-y-5 rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
      {blocks.map((b) => (
        <div key={b.title}>
          <h3 className="nn-marketing-label nn-marketing-label--accent">{b.title}</h3>
          <div className="mt-2">
            <PathwayLessonBody
              text={b.text}
              viewerTier={viewerTier}
              measurementSystem={measurementSystem ?? undefined}
              measurementDual={measurementDual}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Classifies a resolved paragraph block so the renderer can pick the right
 * HTML element — plain text, bullet list, or a labelled list (bold header + bullets).
 *
 * Patterns we handle:
 *   "text" — regular prose paragraph (no bullet lines)
 *   "list" — every line starts with "- " (pure bullet list)
 *   "headed-list" — first line is prose, remaining lines all start with "- "
 *
 * This converts markdown-style lesson content into scannable HTML structure
 * without requiring a full markdown parser.
 */
type ParagraphBlock =
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "headed-list"; header: string; items: string[] };

function isBulletLine(line: string): boolean {
  return /^[ \t]*-\s+/.test(line);
}

function stripBullet(line: string): string {
  return line.replace(/^[ \t]*-\s+/, "");
}

function parseParagraphBlock(raw: string): ParagraphBlock {
  const p = raw.trim();
  const lines = p.split("\n");

  // Pure bullet list: every line starts with "- "
  if (lines.length > 0 && lines.every(isBulletLine)) {
    return { kind: "list", items: lines.map(stripBullet) };
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
  /**
   * When set, `<TierBlock tier="PN|RN|NP|ALL">` regions are filtered for that ladder.
   * When omitted, all tier blocks are unwrapped (legacy / unspecified context).
   */
  viewerTier,
  /** When set, `{{measurement_token}}` placeholders resolve to region-aware units. */
  measurementSystem,
  /** Show secondary unit in parentheses (e.g. dual US/SI). */
  measurementDual,
}: {
  text: string;
  /** Base URL for `[label](LESSON:slug)` → `{base}/{slug}` (same hub as this lesson). */
  lessonWikiBasePath?: string | null;
  viewerTier?: TierCode | null;
  measurementSystem?: MeasurementSystem | null;
  measurementDual?: boolean;
}) {
  const paragraphs = pathwayLessonResolvedParagraphs(text, {
    viewerTier,
    measurementSystem,
    measurementDual,
  });
  if (paragraphs.length === 0) {
    return null;
  }
  return (
    <div className="nn-lesson-prose space-y-6">
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
  /** Shown when there is no prose, no exam-focus blocks, and no figures (subscriber lesson). */
  emptyBodyMessage: string;
  /** Short line when prose is empty but figures carry the teaching. */
  figuresVisualLeadMessage: string;
}) {
  const paragraphs = pathwayLessonResolvedParagraphs(text, {
    viewerTier,
    measurementSystem,
    measurementDual,
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
    <div className="space-y-4">
      {bodyEl}
      {examEl}
      {showFiguresLead ? <LearnerSparsePanel>{figuresVisualLeadMessage}</LearnerSparsePanel> : null}
      {figuresEl}
      {showEmptyPanel ? <LearnerSparsePanel>{emptyBodyMessage}</LearnerSparsePanel> : null}
    </div>
  );
}
