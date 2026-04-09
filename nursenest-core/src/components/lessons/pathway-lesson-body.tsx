import type { ReactNode } from "react";
import Link from "next/link";
import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonFigures } from "@/components/lessons/pathway-lesson-figures";

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
}: {
  text: string;
  /** Base URL for `[label](LESSON:slug)` → `{base}/{slug}` (same hub as this lesson). */
  lessonWikiBasePath?: string | null;
}) {
  const safe = typeof text === "string" ? text : "";
  const paragraphs = safe.split(/\n\n/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) {
    return (
      <p className="nn-lesson-prose italic text-muted-foreground">
        This section has no content yet. Check back after the next content update.
      </p>
    );
  }
  return (
    <div className="nn-lesson-prose space-y-6">
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
}: {
  text: string;
  figures?: PathwayLessonFigure[] | undefined;
  lessonWikiBasePath?: string | null;
}) {
  return (
    <div>
      <PathwayLessonBody text={text} lessonWikiBasePath={lessonWikiBasePath} />
      {figures && figures.length > 0 ? <PathwayLessonFigures figures={figures} /> : null}
    </div>
  );
}
