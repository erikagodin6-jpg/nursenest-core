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
  const paragraphs = text.split(/\n\n/).filter(Boolean);
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
