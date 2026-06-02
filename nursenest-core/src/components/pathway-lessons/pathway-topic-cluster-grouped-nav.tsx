import Link from "next/link";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";
import { groupTopicClustersForNavigation } from "@/lib/lessons/lesson-topic-cluster-registry";
import { marketingLessonsTopicClusterPath } from "@/lib/lessons/lesson-routes";

type Props = {
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  pathwayShortName: string;
  /** NP lesson hubs: semantic multi-hue group bands + token-tinted chips (see `premium-redesign-2026.css`). */
  tone?: "default" | "np";
};

const chip = (lessonsBasePath: string, t: TopicCluster, np: boolean) => (
  <li key={t.topicSlug} className="min-w-0 max-w-full">
    <Link
      href={marketingLessonsTopicClusterPath(lessonsBasePath, t.topicSlug)}
      className={
        np
          ? "nn-chip nn-np-topic-chip px-3 py-2 text-sm font-medium leading-snug text-balance sm:max-w-[20rem] sm:whitespace-normal"
          : "nn-chip px-3 py-1.5 text-sm font-medium hover:border-primary/40"
      }
    >
      {t.label} ({t.count})
    </Link>
  </li>
);

/**
 * Topic clusters grouped by editorial bucket (cardiovascular, respiratory, safety, etc.) for scalable navigation at 500+ lessons.
 */
export function PathwayTopicClusterGroupedNav({
  lessonsBasePath,
  topicClusters,
  pathwayShortName,
  tone = "default",
}: Props) {
  if (topicClusters.length === 0) return null;

  const groups = groupTopicClustersForNavigation(topicClusters);
  const isNp = tone === "np";

  return (
    <section
      aria-label="Browse by topic"
      className={
        isNp
          ? "nn-study-card nn-study-card--wash nn-np-topic-browse p-4 sm:p-5"
          : "nn-study-card nn-study-card--wash p-4 sm:p-5"
      }
    >
      <h2 className="nn-marketing-h4 text-[var(--theme-heading-text)]">Browse by topic cluster</h2>
      <p className="nn-marketing-caption mt-1 text-[var(--theme-muted-text)]">
        Organized by clinical theme. Same lessons as the full list ({pathwayShortName}).
      </p>
      <div className="mt-4 space-y-5">
        {groups.map((g) => (
          <div
            key={g.groupId}
            className={isNp ? `nn-np-topic-group nn-np-topic-group--${g.groupId}` : undefined}
            data-nn-np-topic-group={isNp ? g.groupId : undefined}
          >
            <h3
              className={
                isNp
                  ? "nn-np-topic-group-heading text-xs font-semibold uppercase tracking-wide"
                  : "text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]"
              }
            >
              {g.groupTitle}
            </h3>
            <ul className="mt-2 flex flex-wrap gap-2">{g.clusters.map((t) => chip(lessonsBasePath, t, isNp))}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}
