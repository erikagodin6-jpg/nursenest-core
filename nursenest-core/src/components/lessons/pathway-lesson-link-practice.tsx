import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements";
import type { StudyLoopCatAuthState } from "@/lib/exam-pathways/study-loop-cat-routing";
import { resolveStudyLoopCatDestination } from "@/lib/exam-pathways/study-loop-cat-routing";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { marketingLessonsTopicClusterPath } from "@/lib/lessons/lesson-routes";

/** Marketing question hub with optional topic filter (pathway-scoped). */
export function pathwayMarketingQuestionBankTopicHref(
  pathway: ExamPathwayDefinition,
  topic: string,
  topicCode?: string,
): string {
  const base = buildExamPathwayPath(pathway, "questions");
  const t = topic.trim();
  const qs = new URLSearchParams();
  if (t) qs.set("topic", t);
  /** Cluster slug for the public questions hub (`topicSlug` search param). */
  if (topicCode?.trim()) qs.set("topicSlug", topicCode.trim().toLowerCase());
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export type AppQuestionBankDrillOpts = {
  /** Narrow the bank session to specific question ids (comma-separated in URL; max 16). */
  includeIds?: string[];
};

/**
 * Direct `/app/questions` topic drill URL (no login redirect). Use from authenticated app surfaces.
 */
export function buildAppQuestionBankTopicDrillHref(
  pathway: ExamPathwayDefinition,
  topic: string,
  topicCode?: string,
  opts?: AppQuestionBankDrillOpts,
): string {
  const qs = new URLSearchParams();
  qs.set("pathwayId", pathway.id);
  if (topic.trim()) qs.set("topic", topic.trim());
  if (topicCode?.trim()) qs.set("topicCode", topicCode.trim().toLowerCase());
  qs.set("preset", "topic_drill");
  const ids = (opts?.includeIds ?? []).map((id) => id.trim()).filter((id) => id.length >= 8);
  if (ids.length > 0) qs.set("includeIds", ids.slice(0, 16).join(","));
  return `/app/questions?${qs.toString()}`;
}

/** Signed-in app question bank: topic drill for this pathway (via login callback for marketing). */
export function pathwayAppQuestionBankTopicHref(
  pathway: ExamPathwayDefinition,
  topic: string,
  topicCode?: string,
  opts?: AppQuestionBankDrillOpts,
): string {
  return loginWithCallback(buildAppQuestionBankTopicDrillHref(pathway, topic, topicCode, opts));
}

/** Display string when only a topic slug is known (e.g. `fluid-balance` → `Fluid Balance`). */
export function humanizeTopicSlug(slug: string): string {
  const s = slug.trim();
  if (!s) return "";
  return s
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function normalizeLessonTopicContext(topicLabel: string | null | undefined, topicSlug: string | null | undefined) {
  const slug = (topicSlug ?? "").trim().toLowerCase();
  const label = (topicLabel ?? "").trim();
  const effectiveLabel = label || (slug ? humanizeTopicSlug(slug) : "");
  const hasTopicFilter = Boolean(slug) || Boolean(label);
  return { slug, label, effectiveLabel, hasTopicFilter };
}

export type LessonStudyLoopPracticeHrefs = {
  marketing: string;
  app: string;
  hasTopicFilter: boolean;
};

/** Valid marketing + app practice URLs for the lesson study loop (pathway hub at minimum). */
export function lessonStudyLoopPracticeHrefs(
  pathway: ExamPathwayDefinition,
  topicLabel: string | null | undefined,
  topicSlug: string | null | undefined,
): LessonStudyLoopPracticeHrefs {
  const { slug, label, hasTopicFilter } = normalizeLessonTopicContext(topicLabel, topicSlug);
  return {
    marketing: pathwayMarketingQuestionBankTopicHref(pathway, label, slug || undefined),
    app: pathwayAppQuestionBankTopicHref(pathway, label, slug || undefined),
    hasTopicFilter,
  };
}

/** Topic cluster index or full lesson hub. */
export function lessonStudyLoopRelatedLessonsHubHref(lessonsBasePath: string, topicSlug: string | null | undefined): string {
  return marketingLessonsTopicClusterPath(lessonsBasePath, topicSlug);
}

export type LessonStudyLoopCatHrefs = {
  primaryHref: string;
  secondaryHref: string | null;
  primaryKind: "public" | "app_start";
  showAdaptiveShortcut: boolean;
};

export function lessonStudyLoopCatHrefs(
  pathway: ExamPathwayDefinition,
  authState: StudyLoopCatAuthState = "public",
): LessonStudyLoopCatHrefs {
  const show = pathwayAllowsCatAdaptiveStart(pathway);
  const marketingCatPath = buildExamPathwayPath(pathway, "cat");
  const signedInDestination = resolveStudyLoopCatDestination({
    authState: "signed_in",
    pathwayId: pathway.id,
    intent: "start",
  });
  return {
    primaryHref: authState === "signed_in" ? signedInDestination.href : marketingCatPath,
    secondaryHref: authState === "public" && show ? loginWithCallback(marketingCatPath) : null,
    primaryKind: authState === "signed_in" ? "app_start" : "public",
    showAdaptiveShortcut: show,
  };
}

/**
 * Standalone practice strip (marketing question bank + app + topic cluster).
 * On lesson detail pages, prefer `PathwayLessonStudyLoopCta`.
 */
export function PathwayLessonPracticeTopicCta({
  pathway,
  topic,
  topicSlug,
  lessonsBasePath,
}: {
  pathway: ExamPathwayDefinition;
  topic: string;
  topicSlug: string;
  lessonsBasePath: string;
}) {
  const topicHubHref = topicSlug?.trim()
    ? `${lessonsBasePath.replace(/\/$/, "")}/topics/${encodeURIComponent(topicSlug.trim())}`
    : lessonsBasePath;

  return (
    <section
      className="nn-study-callout nn-study-card mt-10 p-5 sm:p-6"
      aria-labelledby="lesson-practice-topic-cta"
    >
      <p className="nn-marketing-label nn-marketing-label--accent">Same scope as this lesson</p>
      <h2 id="lesson-practice-topic-cta" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
        Drill {topic.trim() || "this topic"} with items
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        Answer {pathway.shortName}-scoped questions on {topic.trim() || "this content"} while the clinical story is still fresh.
        If rationales expose a weak spot, jump back to this topic in lessons—not a generic review.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={pathwayAppQuestionBankTopicHref(pathway, topic, topicSlug?.trim() || undefined)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
        >
          Open practice (app)
        </Link>
        <Link
          href={pathwayMarketingQuestionBankTopicHref(pathway, topic, topicSlug?.trim() || undefined)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Practice hub · same topic
        </Link>
        <Link
          href={topicHubHref}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          {topic.trim() || "Topic"} cluster
        </Link>
        <Link
          href={buildExamPathwayPath(pathway, "cat")}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          CAT prep · this pathway
        </Link>
      </div>
    </section>
  );
}

/** @deprecated Prefer {@link PathwayLessonPracticeTopicCta} with full pathway context. */
export function PathwayLessonLinkToPractice({
  topic,
  pathwayId,
  topicSlug,
}: {
  topic: string;
  pathwayId?: string;
  topicSlug?: string;
}) {
  const topicParam = topic.trim() ? `topic=${encodeURIComponent(topic.trim())}` : "";
  const pathwayParam = pathwayId?.trim() ? `pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const qs = [topicParam, pathwayParam, "preset=topic_drill"].filter(Boolean).join("&");
  const questionsHref = qs ? `/app/questions?${qs}` : "/app/questions";

  const pathwayForCat = pathwayId?.trim() ? getExamPathwayById(pathwayId.trim()) : undefined;
  /** Never fall back to `/app/exams` without pathway context — that page is cross-exam history / timed mocks, not CAT prep. */
  const catHref = pathwayForCat
    ? resolveStudyLoopCatDestination({ authState: "signed_in", pathwayId: pathwayForCat.id, intent: "start" }).href
    : resolveStudyLoopCatDestination({ authState: "signed_in", intent: "start" }).href;

  const lessonsForTopicHref = topicSlug?.trim()
    ? `/app/lessons?topicSlug=${encodeURIComponent(topicSlug.trim())}`
    : topic.trim()
      ? `/app/lessons?topic=${encodeURIComponent(topic.trim())}`
      : "/app/lessons";

  return (
    <section className="nn-card border-border bg-muted/30 p-5">
      <h2 className="nn-marketing-h3">Link to practice</h2>
      <p className="mt-2 nn-marketing-body-sm text-muted">
        Reinforce this lesson with questions in your bank, then loop back if a topic stays weak.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={questionsHref}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Practice related questions
        </Link>
        <Link
          href={lessonsForTopicHref}
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          More lessons in this topic
        </Link>
        <Link
          href={catHref}
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          {pathwayForCat ? "Start CAT" : "Choose CAT pathway"}
        </Link>
      </div>
    </section>
  );
}
