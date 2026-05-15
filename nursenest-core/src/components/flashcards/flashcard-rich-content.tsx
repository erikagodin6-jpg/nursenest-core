"use client";

/**
 * Detect if string likely contains HTML markup
 */
export function flashcardTextMayContainMarkup(s: string): boolean {
  const t = s.trim();
  return /<\/?[a-z][\s\S]*>/i.test(t);
}

/**
 * Detect if string contains markdown formatting patterns
 */
function flashcardTextHasMarkdown(s: string): boolean {
  return /\*\*[^*\n]+\*\*/.test(s) || /(?<!\*)\*[^*\n]+\*(?!\*)/.test(s);
}

function sanitizeHtml(html: string): string {
  // basic lightweight sanitization (prevents script injection)
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Convert inline markdown to safe HTML. Input is plain text (no HTML tags).
 * Supports: **bold**, *italic*, and line breaks.
 */
function convertMarkdownToHtml(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    // Bold: **text**
    .replace(/\*\*(.+?)\*\*/gs, "<strong>$1</strong>")
    // Italic: *text* (single asterisk, not double)
    .replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>")
    // Double newline → paragraph break
    .replace(/\n\n+/g, "</p><p>")
    // Single line break
    .replace(/\n/g, "<br />");
}

type Props = {
  text: string;
  className?: string;
  stemClassName?: string;
};

export function FlashcardRichContent({
  text,
  className,
  stemClassName,
}: Props) {
  if (!text || typeof text !== "string") {
    return null;
  }

  const safeText = text.trim();

  // HTML content — sanitize and render
  if (flashcardTextMayContainMarkup(safeText)) {
    return (
      <div
        className={`nn-flashcard-rich nn-question-stem leading-relaxed text-[var(--semantic-text-primary)] ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(safeText) }}
      />
    );
  }

  // Markdown content — convert to safe HTML and render
  if (flashcardTextHasMarkdown(safeText)) {
    return (
      <div
        className={`nn-flashcard-rich nn-question-stem leading-relaxed text-[var(--semantic-text-primary)] [&_p]:mb-2 [&_p:last-child]:mb-0 ${className ?? ""}`}
        dangerouslySetInnerHTML={{ __html: `<p>${convertMarkdownToHtml(safeText)}</p>` }}
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
