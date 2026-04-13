import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * Compact “next best study” link card — distinct from primary CTA, still premium.
 */
export function LearnerStudyRecommendationCard({
  href,
  title,
  body,
  meta,
}: {
  href: string;
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="nn-ls-rec group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="nn-ls-rec__title">{title}</p>
          <p className="nn-ls-rec__body">{body}</p>
          {meta ? <p className="nn-ls-rec__meta">{meta}</p> : null}
        </div>
        <ArrowRight
          className="mt-1 h-4 w-4 shrink-0 text-[var(--semantic-brand)] opacity-70 transition motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:opacity-100"
          aria-hidden
        />
      </div>
    </Link>
  );
}
