import Link from "next/link";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";

/** Beyond this, chips collapse behind a disclosure to avoid giant scroll walls on mobile. */
export const PATHWAY_TOPIC_CLUSTER_NAV_COLLAPSE_AFTER = 14;

type Props = {
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  pathwayShortName: string;
};

/**
 * Crawlable topic links: every topic stays a real `<Link>` in the document (inside `<details>` when collapsed).
 */
export function PathwayTopicClusterNav({ lessonsBasePath, topicClusters, pathwayShortName }: Props) {
  if (topicClusters.length === 0) return null;

  const visible = topicClusters.slice(0, PATHWAY_TOPIC_CLUSTER_NAV_COLLAPSE_AFTER);
  const overflow = topicClusters.slice(PATHWAY_TOPIC_CLUSTER_NAV_COLLAPSE_AFTER);
  const hasOverflow = overflow.length > 0;

  const chip = (t: TopicCluster) => (
    <li key={t.topicSlug}>
      <Link
        href={`${lessonsBasePath}/topics/${t.topicSlug}`}
        className="inline-flex rounded-full border border-border bg-[var(--theme-muted-surface)] px-3 py-1.5 text-sm font-medium hover:border-primary/40"
      >
        {t.label} ({t.count})
      </Link>
    </li>
  );

  return (
    <section aria-label="Browse by topic" className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
      <p className="mt-1 text-xs text-muted">
        Same lessons, alternate index — useful when you study by organ system or theme ({pathwayShortName}).
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">{visible.map(chip)}</ul>
      {hasOverflow ? (
        <details className="mt-3 group rounded-lg border border-dashed border-border bg-[var(--theme-muted-surface)]/50 p-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
            <span className="underline-offset-2 group-open:underline">
              All topic clusters ({topicClusters.length}) — expand
            </span>
          </summary>
          <ul className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">{overflow.map(chip)}</ul>
        </details>
      ) : null}
    </section>
  );
}
