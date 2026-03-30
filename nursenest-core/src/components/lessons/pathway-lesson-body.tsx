import type { ReactNode } from "react";

function inlineBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function PathwayLessonBody({ text }: { text: string }) {
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
          {inlineBold(p)}
        </p>
      ))}
    </div>
  );
}
