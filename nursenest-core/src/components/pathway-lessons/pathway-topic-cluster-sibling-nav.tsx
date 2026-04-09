import Link from "next/link";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";

type Props = {
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  /** Current topic page slug — excluded from chips. */
  currentTopicSlug: string;
  /** Cap visible siblings to avoid noisy grids on huge pathways. */
  maxSiblings?: number;
};

/**
 * Compact “other topics” strip on topic cluster pages — pathway-aware, excludes current cluster.
 */
export function PathwayTopicClusterSiblingNav({
  lessonsBasePath,
  topicClusters,
  currentTopicSlug,
  maxSiblings = 16,
}: Props) {
  const siblings = topicClusters
    .filter((t) => t.topicSlug !== currentTopicSlug)
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, maxSiblings);

  if (siblings.length === 0) return null;

  const base = lessonsBasePath.replace(/\/$/, "");

  return (
    <nav aria-label="Other topic clusters in this pathway" className="nn-study-card nn-study-card--wash p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Explore other topics</p>
      <p className="nn-marketing-caption mt-1 text-muted-foreground">
        Same exam scope — jump to another cluster without returning to the full lesson list.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {siblings.map((t) => (
          <li key={t.topicSlug}>
            <Link
              href={`${base}/topics/${encodeURIComponent(t.topicSlug)}`}
              className="nn-chip inline-flex items-center px-3 py-1.5 text-sm font-medium hover:border-primary/40"
            >
              {t.label}
              <span className="ml-1.5 tabular-nums text-muted-foreground">({t.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
