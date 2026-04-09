import Link from "next/link";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";
import { groupTopicClustersForNavigation } from "@/lib/lessons/lesson-topic-cluster-registry";

type Props = {
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  pathwayShortName: string;
};

const chip = (lessonsBasePath: string, t: TopicCluster) => (
  <li key={t.topicSlug}>
    <Link
      href={`${lessonsBasePath}/topics/${t.topicSlug}`}
      className="inline-flex rounded-full border border-border bg-[var(--theme-muted-surface)] px-3 py-1.5 text-sm font-medium hover:border-primary/40"
    >
      {t.label} ({t.count})
    </Link>
  </li>
);

/**
 * Topic clusters grouped by editorial bucket (cardiovascular, respiratory, safety, etc.) for scalable navigation at 500+ lessons.
 */
export function PathwayTopicClusterGroupedNav({ lessonsBasePath, topicClusters, pathwayShortName }: Props) {
  if (topicClusters.length === 0) return null;

  const groups = groupTopicClustersForNavigation(topicClusters);

  return (
    <section aria-label="Browse by topic" className="rounded-xl border border-border bg-card p-4">
      <h2 className="text-sm font-bold text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
      <p className="mt-1 text-xs text-muted">
        Organized by clinical theme — same lessons as the full list ({pathwayShortName}).
      </p>
      <div className="mt-4 space-y-5">
        {groups.map((g) => (
          <div key={g.groupId}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{g.groupTitle}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">{g.clusters.map((t) => chip(lessonsBasePath, t))}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
