import type { ReactNode } from "react";
import Link from "next/link";
import type { PathwayLessonFigure } from "@/lib/lessons/pathway-lesson-types";
import { PathwayLessonFigures } from "@/components/lessons/pathway-lesson-figures";

function inlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function resolveHref(raw: string, lessonLinkBase: string | undefined): string | null {
  const t = raw.trim();
  if (t.startsWith("LESSON:")) {
    if (!lessonLinkBase?.trim()) return null;
    const slug = t.slice("LESSON:".length).trim();
    if (!slug) return null;
    const base = lessonLinkBase.replace(/\/$/, "");
    return `${base}/${encodeURIComponent(slug)}`;
  }
  if (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")) return t;
  return null;
}

/** Renders [label](url) with support for LESSON:slug internal wiki links. */
function paragraphWithMarkdownLinks(text: string, lessonLinkBase: string | undefined): ReactNode {
  const re = /\[([^\]]+)\]\((LESSON:[^)\s]+|https?:\/\/[^)\s]+|\/[^)\s]+)\)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      out.push(<span key={`t-${key++}`}>{inlineBold(text.slice(last, m.index))}</span>);
    }
    const label = m[1] ?? "";
    const href = resolveHref(m[2] ?? "", lessonLinkBase);
    if (href) {
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      if (isExternal) {
        out.push(
          <a
            key={`a-${key++}`}
            href={href}
            className="font-medium text-primary underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {inlineBold(label)}
          </a>,
        );
      } else {
        out.push(
          <Link key={`a-${key++}`} href={href} className="font-medium text-primary underline-offset-2 hover:underline">
            {inlineBold(label)}
          </Link>,
        );
      }
    } else {
      out.push(<span key={`f-${key++}`}>{inlineBold(m[0])}</span>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push(<span key={`t-${key++}`}>{inlineBold(text.slice(last))}</span>);
  }
  return out.length ? out : inlineBold(text);
}

export function PathwayLessonBodyLinked({
  text,
  lessonLinkBase,
}: {
  text: string;
  lessonLinkBase?: string;
}) {
  const safe = typeof text === "string" ? text : "";
  const paragraphs = safe.split(/\n\n/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        This section has no content yet. Check back after the next content update.
      </p>
    );
  }
  return (
    <div className="space-y-3 text-sm leading-relaxed text-[var(--theme-body-text)]">
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {paragraphWithMarkdownLinks(p, lessonLinkBase)}
        </p>
      ))}
    </div>
  );
}

export function PathwayLessonSectionContentLinked({
  text,
  figures,
  lessonLinkBase,
}: {
  text: string;
  figures?: PathwayLessonFigure[] | undefined;
  lessonLinkBase?: string;
}) {
  return (
    <div>
      <PathwayLessonBodyLinked text={text} lessonLinkBase={lessonLinkBase} />
      {figures && figures.length > 0 ? <PathwayLessonFigures figures={figures} /> : null}
    </div>
  );
}
