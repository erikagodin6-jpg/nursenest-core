import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { PathwayTopicClusterGroupedNav } from "@/components/pathway-lessons/pathway-topic-cluster-grouped-nav";
import type { TopicCluster } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import {
  pathwayLessonMarketingDetailHref,
  type PathwayLessonRecord,
} from "@/lib/lessons/pathway-lesson-types";
import { StudyCard } from "@/components/ui/study-card";
import type { CardVariant, CardStatus } from "@/components/ui/study-card";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

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

function progressToCardVariant(status: PathwayLessonProgressStatus): CardVariant {
  if (status === "completed") return "completed";
  return "default";
}

function progressToCardStatus(status: PathwayLessonProgressStatus, showProgress: boolean): CardStatus | undefined {
  if (!showProgress) return undefined;
  if (status === "completed") return "completed";
  if (status === "in_progress") return "in_progress";
  return undefined;
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
  /** NP pathways (AGPCNP, PMHNP, CNPLE, …): richer cards, related rows, practice tiles — still one list per page. */
  visualTone?: "default" | "np";
};

/**
 * Generic pathway lessons hub: topic-grouped cards, progression cues, practice links.
 * Used when a pathway does not use the NCLEX-RN / PN / FNP bespoke hubs.
 */
function relatedLessonsForCard(
  groupLessons: PathwayLessonRecord[],
  current: PathwayLessonRecord,
  lessonsBasePath: string,
  max: number,
): { href: string; title: string }[] {
  const topic = (current.topic ?? "").trim();
  const sameTopic = groupLessons.filter(
    (x) => x.slug !== current.slug && (x.topic ?? "").trim() === topic && topic.length > 0,
  );
  const pool = sameTopic.length > 0 ? sameTopic : groupLessons.filter((x) => x.slug !== current.slug);
  const out: { href: string; title: string }[] = [];
  for (const x of pool) {
    const href = pathwayLessonMarketingDetailHref(lessonsBasePath, x.slug);
    if (href) out.push({ href, title: cleanLessonTitleForDisplay(x.title) });
    if (out.length >= max) break;
  }
  return out;
}

export function PathwayLessonsGroupedHub({
  pathway,
  lessons,
  lessonsBasePath,
  topicClusters,
  progressMap = {},
  canShowProgressMap = false,
  visualTone = "default",
}: Props) {
  const groups = buildTopicGroups(lessons, topicClusters);
  const showProgress = canShowProgressMap && Object.keys(progressMap).length > 0;
  const isNp = visualTone === "np";

  return (
    <div className={isNp ? "nn-np-hub-root space-y-10" : "space-y-10"}>
      <section className="nn-study-card nn-study-card--wash p-5 sm:p-6" aria-labelledby="lessons-guided-path">
        <p className="nn-marketing-label nn-marketing-label--accent">How to use this hub</p>
        <h2 id="lessons-guided-path" className="nn-marketing-h3 mt-2">
          Learn the concept, then stress-test it under exam rules
        </h2>
        <ol className="nn-marketing-body-sm mt-4 list-none space-y-2.5 pl-0 text-[var(--theme-muted-text)]">
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">1. Choose a clinical topic</span> — grouped the way{" "}
            {pathway.shortName} expects you to think on the floor and on the exam.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">2. Read for judgment</span> — previews stay public;
            subscribers see full depth aligned to your plan.
          </li>
          <li>
            <span className="font-semibold text-[var(--theme-heading-text)]">3. Drill items in the same scope</span> — practice
            questions match this pathway, then circle back wherever rationales still bite.
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
            <div
              className={
                isNp
                  ? "nn-study-card nn-study-card--wash flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5"
                  : "flex flex-wrap items-end justify-between gap-3 border-b border-[color-mix(in_srgb,var(--border-subtle)_82%,var(--theme-primary))] pb-4"
              }
            >
              <div>
                <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--theme-primary)]">
                  Block {gi + 1} · {group.lessons.length} lesson{group.lessons.length === 1 ? "" : "s"}
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
                    Topic index
                  </Link>
                ) : null}
                <Link
                  href={marketingQuestionsTopicHref(pathway, group.lessons[0]?.topic ?? group.label)}
                  className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
                >
                  Practice questions · this topic
                </Link>
                <Link
                  href={appPracticeTopicHref(pathway, group.lessons[0]?.topic ?? group.label)}
                  className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
                >
                  Drill in app
                </Link>
              </div>
            </div>

            <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-1">
              {group.lessons.map((l, idx) => {
                const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
                if (!href) return null;
                const ps = progressMap[l.slug] ?? "not_started";
                const related = isNp ? relatedLessonsForCard(group.lessons, l, lessonsBasePath, 3) : [];
                return (
                  <li
                    key={l.slug}
                    data-nn-qa-primary-lesson={gi === 0 && idx === 0 ? "true" : undefined}
                  >
                    {isNp ? (
                      /* NP pathway: richer card with related lessons and practice tiles */
                      <div className="nn-study-card nn-lesson-list-card flex h-full flex-col p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="nn-marketing-caption font-semibold text-[var(--theme-muted-text)]">
                            Item {idx + 1} · {l.topic}
                          </p>
                          {showProgress ? <PathwayLessonProgressBadge status={ps} /> : null}
                        </div>
                        <Link
                          href={href}
                          data-nn-qa-primary-lesson={gi === 0 && idx === 0 ? "true" : undefined}
                          className="nn-marketing-h4 mt-2 text-[var(--theme-heading-text)] underline-offset-4 transition hover:text-primary hover:underline"
                        >
                          {cleanLessonTitleForDisplay(l.title)}
                        </Link>
                        <p className="nn-marketing-body-sm mt-2 line-clamp-3 flex-1 text-[var(--theme-muted-text)]">
                          {l.seoDescription}
                        </p>
                        {related.length > 0 ? (
                          <div className="mt-4 border-t border-border/50 pt-4">
                            <p className="nn-marketing-caption font-semibold text-[var(--theme-heading-text)]">
                              More in this topic
                            </p>
                            <ul className="mt-2 grid list-none gap-2 p-0 sm:grid-cols-2">
                              {related.map((r) => (
                                <li key={r.href}>
                                  <Link
                                    href={r.href}
                                    className="nn-surface-inset block rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/35"
                                  >
                                    {r.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <Link
                            href={marketingQuestionsTopicHref(pathway, l.topic ?? group.label)}
                            className="nn-surface-elevated block rounded-xl p-3 transition-colors hover:border-primary/35"
                          >
                            <p className="nn-marketing-caption font-semibold text-[var(--theme-primary)]">Practice hub</p>
                            <p className="nn-marketing-body-sm mt-0.5 text-[var(--theme-muted-text)]">
                              Items filtered to this topic
                            </p>
                          </Link>
                          <Link
                            href={appPracticeTopicHref(pathway, l.topic ?? group.label)}
                            className="nn-surface-elevated block rounded-xl p-3 transition-colors hover:border-primary/35"
                          >
                            <p className="nn-marketing-caption font-semibold text-[var(--theme-primary)]">App practice</p>
                            <p className="nn-marketing-body-sm mt-0.5 text-[var(--theme-muted-text)]">
                              Case items with rationales
                            </p>
                          </Link>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
                          <Link
                            href={href}
                            className="inline-flex min-h-10 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
                          >
                            Read lesson
                          </Link>
                        </div>
                      </div>
                    ) : (
                      /* Standard pathways: StudyCard for visual consistency */
                      <StudyCard
                        surface="list"
                        variant={progressToCardVariant(ps)}
                        status={progressToCardStatus(ps, showProgress)}
                        title={cleanLessonTitleForDisplay(l.title)}
                        href={href}
                        description={l.seoDescription}
                        meta={[{ label: `Item ${idx + 1}` }, { label: l.topic ?? group.label }]}
                        cta="Read lesson"
                        ctaVariant="primary"
                        footer={
                          <Link
                            href={appPracticeTopicHref(pathway, l.topic)}
                            className="mt-3 inline-flex min-h-10 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
                          >
                            Drill this topic
                          </Link>
                        }
                        ariaLabel={cleanLessonTitleForDisplay(l.title)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="nn-study-callout p-5 sm:p-6">
        <h2 className="nn-marketing-h3">What works on the floor and on the test</h2>
        <p className="nn-marketing-body-sm mt-2 text-[var(--theme-muted-text)]">
          Read → answer items in this same licensure scope → read rationales → chase the topic that still feels shaky. Keeping
          everything inside {pathway.shortName} protects you from mixed US/Canada language or out-of-scope content.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={buildExamPathwayPath(pathway, "questions")}
            className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
          >
            {pathway.shortName} practice hub
          </Link>
          <Link
            href={loginWithCallback(`/app/questions?pathwayId=${encodeURIComponent(pathway.id)}`)}
            className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-4 py-2 text-sm font-semibold shadow-none"
          >
            Open practice in app
          </Link>
          <Link
            href={buildExamPathwayPath(pathway, "cat")}
            className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-4 py-2 text-sm font-semibold"
          >
            CAT prep · this pathway
          </Link>
        </div>
      </section>
    </div>
  );
}
