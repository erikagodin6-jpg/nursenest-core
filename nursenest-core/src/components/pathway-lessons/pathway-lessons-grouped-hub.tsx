import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { PathwayTopicClusterGroupedNav } from "@/components/pathway-lessons/pathway-topic-cluster-grouped-nav";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";

type Group = {
  topicSlug: string;
  label: string;
  lessons: PathwayLessonRecord[];
};

function buildTopicGroups(lessons: PathwayLessonRecord[], clusters: TopicCluster[]): Group[] {
  const bySlug = new Map<string, PathwayLessonRecord[]>();
  for (const l of lessons) {
    const slug = (l.topicSlug ?? "").trim() || "_general";
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug)!.push(l);
  }

  const out: Group[] = [];
  const used = new Set<string>();

  for (const c of clusters) {
    const list = bySlug.get(c.topicSlug);
    if (list?.length) {
      out.push({ topicSlug: c.topicSlug, label: c.label, lessons: list });
      used.add(c.topicSlug);
    }
  }

  for (const [slug, list] of bySlug) {
    if (!list.length || used.has(slug)) continue;
    const label = list[0]?.topic?.trim() || slug.replace(/^_/u, "") || "Lessons";
    out.push({ topicSlug: slug, label, lessons: list });
  }

  return out;
}

function marketingQuestionsTopicHref(pathway: ExamPathwayDefinition, topic: string): string {
  const base = buildExamPathwayPath(pathway, "questions");
  const t = topic.trim();
  if (!t) return base;
  return `${base}?topic=${encodeURIComponent(t)}`;
}

function appPracticeTopicHref(pathway: ExamPathwayDefinition, topic: string): string {
  const qs = new URLSearchParams();
  qs.set("pathwayId", pathway.id);
  if (topic.trim()) qs.set("topic", topic.trim());
  return loginWithCallback(`/app/questions?${qs.toString()}`);
}

type Props = {
  pathway: ExamPathwayDefinition;
  lessons: PathwayLessonRecord[];
  lessonsBasePath: string;
  topicClusters: TopicCluster[];
  progressMap?: Record<string, PathwayLessonProgressStatus>;
  canShowProgressMap?: boolean;
};

/**
 * Generic pathway lessons hub: topic-grouped cards, progression cues, practice links.
 * Used when a pathway does not use the NCLEX-RN / PN / FNP bespoke hubs.
 */
export function PathwayLessonsGroupedHub({
  pathway,
  lessons,
  lessonsBasePath,
  topicClusters,
  progressMap = {},
  canShowProgressMap = false,
}: Props) {
  const groups = buildTopicGroups(lessons, topicClusters);
  const showProgress = canShowProgressMap && Object.keys(progressMap).length > 0;

  return (
    <div className="space-y-10">
      <section className="nn-study-card nn-study-card--wash p-5 sm:p-6" aria-labelledby="lessons-guided-path">
        <p className="nn-marketing-label nn-marketing-label--accent">Your study path</p>
        <h2 id="lessons-guided-path" className="nn-marketing-h3 mt-2">
          Work by topic, then drill questions in the same exam track
        </h2>
        <ol className="nn-marketing-body-sm mt-4 list-none space-y-2.5 pl-0 text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">1. Pick a topic</span> below — groups follow
            published lesson categories for {pathway.shortName}.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">2. Read the lesson</span> — preview sections stay
            public; full depth matches your plan.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">3. Practice the topic</span> in the question bank
            with the same pathway scope, then revisit weak areas.
          </li>
        </ol>
      </section>

      <PathwayTopicClusterGroupedNav
        lessonsBasePath={lessonsBasePath}
        topicClusters={topicClusters}
        pathwayShortName={pathway.shortName}
      />

      <div className="space-y-12">
        {groups.map((group, gi) => (
          <section
            key={group.topicSlug}
            id={group.topicSlug.startsWith("_") ? undefined : `topic-${group.topicSlug}`}
            className="scroll-mt-28"
            aria-labelledby={`topic-heading-${group.topicSlug}`}
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 pb-4">
              <div>
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-primary)]">
                  Topic {gi + 1} · {group.lessons.length} lesson{group.lessons.length === 1 ? "" : "s"}
                </p>
                <h2 id={`topic-heading-${group.topicSlug}`} className="nn-marketing-h2 mt-1">
                  {group.label}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.topicSlug && !group.topicSlug.startsWith("_") ? (
                  <Link
                    href={`${lessonsBasePath}/topics/${encodeURIComponent(group.topicSlug)}`}
                    className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
                  >
                    Topic hub
                  </Link>
                ) : null}
                <Link
                  href={marketingQuestionsTopicHref(pathway, group.lessons[0]?.topic ?? group.label)}
                  className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
                >
                  Question bank · this topic
                </Link>
                <Link
                  href={appPracticeTopicHref(pathway, group.lessons[0]?.topic ?? group.label)}
                  className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
                >
                  Practice in app
                </Link>
              </div>
            </div>

            <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-1">
              {group.lessons.map((l, idx) => {
                const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
                if (!href) return null;
                const ps = progressMap[l.slug] ?? "not_started";
                return (
                  <li key={l.slug}>
                    <div className="nn-study-card flex h-full flex-col p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="nn-marketing-caption font-semibold text-[var(--theme-muted-text)]">
                          Step {idx + 1} · {l.topic}
                        </p>
                        {showProgress ? <PathwayLessonProgressBadge status={ps} /> : null}
                      </div>
                      <Link href={href} className="nn-marketing-h4 mt-2 text-primary hover:underline">
                        {l.title}
                      </Link>
                      <p className="nn-marketing-body-sm mt-2 line-clamp-3 flex-1 text-[var(--theme-muted-text)]">
                        {l.seoDescription}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
                        <Link
                          href={href}
                          className="inline-flex min-h-10 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
                        >
                          Open lesson
                        </Link>
                        <Link
                          href={appPracticeTopicHref(pathway, l.topic)}
                          className="inline-flex min-h-10 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
                        >
                          Practice this topic
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="nn-study-callout p-5 sm:p-6">
        <h2 className="nn-marketing-h3">Recommended loop</h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Lesson → pathway-scoped questions → rationales → next weak topic. Stay inside {pathway.shortName} so scope and
          language match your exam.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={buildExamPathwayPath(pathway, "questions")}
            className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
          >
            {pathway.shortName} question bank (hub)
          </Link>
          <Link
            href={loginWithCallback(`/app/questions?pathwayId=${encodeURIComponent(pathway.id)}`)}
            className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
          >
            Open app question bank
          </Link>
          <Link href="/app/exams" className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold">
            Practice exams
          </Link>
        </div>
      </section>
    </div>
  );
}
