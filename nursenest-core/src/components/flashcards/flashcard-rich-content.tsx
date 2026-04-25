"use client";

/**
 * Detect if string likely contains HTML markup
 */
export function flashcardTextMayContainMarkup(s: string): boolean {
  const t = s.trim();
  return /<\/?[a-z][\s\S]*>/i.test(t);
}

type Props = {
  text: string;
  className?: string;
  stemClassName?: string;
};

function sanitizeHtml(html: string): string {
  // basic lightweight sanitization (prevents script injection)
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

export function FlashcardRichContent({
  text,
  className,
  stemClassName,
}: Props) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const safeText = text.trim();

  // HTML content
  if (flashcardTextMayContainMarkup(safeText)) {
    return (
      <div
        className={`nn-flashcard-rich nn-question-stem leading-relaxed text-[var(--semantic-text-primary)] ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(safeText) }}
      />
    );
  }

  // Plain text
  return (
    <p
      className={`nn-question-stem whitespace-pre-wrap leading-relaxed text-[var(--semantic-text-primary)] ${stemClassName ?? ""} ${className ?? ""}`}
    >
      {safeText}
    </p>
  );
}