import type { ReactNode } from "react";

type Props = {
  summary: string;
  /** Subtitle under the summary line (keeps the lesson list visually primary). */
  hint?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Long-form study guidance after the lesson list: collapsed by default so hubs paint less DOM
 * on first load (mobile / low-end). Content remains in the document for SEO.
 */
export function PathwayHubSupplementaryDisclosure({ summary, hint, children, className = "" }: Props) {
  return (
    <details className={`group rounded-2xl border border-border bg-card open:shadow-sm ${className}`}>
      <summary className="cursor-pointer list-none px-4 py-4 text-base font-semibold text-[var(--theme-heading-text)] sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="text-primary underline-offset-2 group-open:underline">{summary}</span>
        {hint ? <span className="mt-1 block text-sm font-normal text-muted">{hint}</span> : null}
      </summary>
      <div className="nn-content-visibility-auto space-y-14 border-t border-border px-4 pb-6 pt-4 sm:px-5">{children}</div>
    </details>
  );
}
