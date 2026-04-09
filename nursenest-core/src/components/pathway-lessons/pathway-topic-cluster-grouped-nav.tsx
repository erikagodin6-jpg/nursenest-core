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
    <Link href={`${lessonsBasePath}/topics/${t.topicSlug}`} className="nn-chip px-3 py-1.5 text-sm font-medium hover:border-primary/40">
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
    <section id="topic-cluster-nav" aria-label="Browse by topic" className="nn-study-card nn-study-card--wash p-4 sm:p-5">
      <h2 className="nn-marketing-h4 text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
      <p className="nn-marketing-caption mt-1 text-muted">
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
