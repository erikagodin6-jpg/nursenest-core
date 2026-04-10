import type { ReactNode } from "react";
import Link from "next/link";
import type { TierCode } from "@prisma/client";
import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";
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
  const raw = typeof text === "string" ? text : "";
  let safe = resolveTierBlocksForViewer(raw, viewerTier);
  if (measurementSystem != null) {
    safe = resolveMeasurementTokens(safe, measurementSystem, { dual: measurementDual === true });
  }
  const paragraphs = safe.split(/\n\n/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) {
    return (
      <p className="nn-lesson-prose italic text-muted-foreground">
        This section has no content yet. Check back after the next content update.
      </p>
    );
  }
  return (
    <div className="nn-lesson-prose space-y-7">
      {paragraphs.map((p, idx) => (
        <p key={idx} className="whitespace-pre-wrap">
          {renderParagraphWithLinks(p.trim(), lessonWikiBasePath, `para-${idx}`)}
        </p>
      ))}
    </div>
  );
}

/** Section body plus optional structured figures (catalog / DB JSON). */
export function PathwayLessonSectionContent({
  text,
  figures,
  lessonWikiBasePath,
  viewerTier,
  measurementSystem,
  measurementDual,
}: {
  text: string;
  figures?: PathwayLessonFigure[] | undefined;
  lessonWikiBasePath?: string | null;
  viewerTier?: TierCode | null;
  measurementSystem?: MeasurementSystem | null;
  measurementDual?: boolean;
}) {
  return (
    <div>
      <PathwayLessonBody
        text={text}
        lessonWikiBasePath={lessonWikiBasePath}
        viewerTier={viewerTier}
        measurementSystem={measurementSystem}
        measurementDual={measurementDual}
      />
      {figures && figures.length > 0 ? <PathwayLessonFigures figures={figures} /> : null}
    </div>
  );
}
