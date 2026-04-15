"use client";

/**
 * Flashcard `front` / `back` fields may be plain text or legacy HTML (e.g. synced items with <img>).
 * Prefer semantic study typography; only treat as HTML when markup is clearly present.
 */
export function flashcardTextMayContainMarkup(s: string): boolean {
  const t = s.trim();
  return /<\/?[a-z][\s\S]*>/i.test(t);
}

type Props = {
  text: string;
  className?: string;
  /** Added on the wrapper for plain-text paragraphs */
  stemClassName?: string;
};

export function FlashcardRichContent({ text, className, stemClassName }: Props) {
  if (flashcardTextMayContainMarkup(text)) {
    return (
      <div
        className={`nn-flashcard-rich nn-question-stem ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }
  return <p className={`nn-question-stem whitespace-pre-wrap ${stemClassName ?? ""} ${className ?? ""}`}>{text}</p>;
}
