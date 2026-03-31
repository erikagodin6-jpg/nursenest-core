import Link from "next/link";
import {
  BlogPostStatus,
  ContentStatus,
  CountryCode,
  ExamFamily,
  JobStatus,
  TierCode,
} from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import { buildContentScalabilityReport } from "@/lib/scalability/build-content-scalability-report";
import { loadAdminQaIssueSnapshot } from "@/lib/admin/admin-qa-snapshot";
import { loadContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import {
  EXAM_PRESET_PN_MIXED_2026_TAG,
  EXAM_PRESET_RN_MIXED_2026_TAG,
  EXAM_PRESET_US_PN_FULL_2026_TAG,
  EXAM_PRESET_US_RN_FULL_2026_TAG,
} from "@/lib/exams/practice-exam-presets";
import { AdminOpsActionsPanel } from "@/components/admin/admin-ops-actions-panel";
import { AdminBlogSchedulerPanel } from "@/components/admin/admin-blog-scheduler-panel";
import { AdminQualityFlagReviewPanel } from "@/components/admin/admin-quality-flag-review-panel";

export const dynamic = "force-dynamic";

function fmtPct(n: number | null) {
  if (n === null) return "—";
  return `${n}%`;
}

function fmtTs(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function readinessLabel(readiness: "ready" | "partial" | "not_ready") {
  if (readiness === "ready") return "bg-emerald-100 text-emerald-900";
  if (readiness === "partial") return "bg-amber-100 text-amber-900";
  return "bg-rose-100 text-rose-900";
}

function pathwayBucket(p: (typeof EXAM_PATHWAYS)[number]) {
  if (p.roleTrack === "rn") return "RN";
  if (p.roleTrack === "rpn" || p.roleTrack === "lpn") return "PN/LPN/LVN/RPN";
  if (p.roleTrack === "np") return "NP";
  return "Allied";
}

const PRESET_TAGS = [
  "mixed-practice-2026-rn-pn",
  EXAM_PRESET_RN_MIXED_2026_TAG,
  EXAM_PRESET_PN_MIXED_2026_TAG,
  EXAM_PRESET_US_RN_FULL_2026_TAG,
  EXAM_PRESET_US_PN_FULL_2026_TAG,
] as const;
const QUALITY_FLAG_TAGS = ["quality:short-stem", "quality:duplicate-options", "quality:synthetic-rationale"] as const;

async function countPresetInventory(tag: string, tierWhere?: string[]) {
  return prisma.examQuestion.count({
    where: {
      status: "published",
      tags: { has: tag },
      ...(tierWhere ? { tier: { in: tierWhere } } : {}),
    },
  });
}

async function countPresetCatchAll(tag: string) {
  return prisma.examQuestion.count({
    where: {
      status: "published",
      AND: [{ tags: { has: tag } }, { tags: { has: "topic:general-nursing-clinical" } }],
    },
  });
}

export default async function AdminPage() {
  await requireAdmin();
  const stats = await loadAdminDashboardStats();

  const qaSnapshot = await loadAdminQaIssueSnapshot();
  const contentQuality = await loadContentQualitySnapshot();
  const questionDiag = await buildQuestionBankCoverageReport();
  const scalability = await buildContentScalabilityReport();
  let lessonCount = 0;
  let questionCount = 0;
  let draftQuestions = 0;
  let reviewQuestions = 0;
  let jobPending = 0;
  let userCount = 0;
  let flashcardPublished = 0;
  let flashcardDecksPublished = 0;
  let examsPublished = 0;
  let totalBlogPosts = 0;
  let publishedBlogPosts = 0;
  let scheduledBlogPosts = 0;
  let nextScheduledBlog: { publishAt: Date | null } | null = null;
  let blogRows: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    exam: string | null;
    category: string | null;
    tags: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    postStatus: BlogPostStatus;
    publishAt: Date | null;
    updatedAt: Date;
  }> = [];
  let flashcardsByExamFamily: Array<{ examFamily: ExamFamily; count: number }> = [];
  let flashcardsByTier: Array<{ tier: TierCode; count: number }> = [];
  let flashcardsByCategory: Array<{ categoryId: string; count: number }> = [];
  let lessonsByPathway: Array<{ pathwayId: string; status: ContentStatus; locale: string; count: number }> = [];
  let jobsRecent: Array<{
    id: string;
    type: string;
    status: JobStatus;
    createdAt: Date;
    scheduledFor: Date | null;
    attempts: number;
    lastError: string | null;
  }> = [];
  let presetInventory: Array<{ tag: string; count: number }> = [];
  let examsByFamilyAndCountry: Array<{ examFamily: ExamFamily; country: CountryCode; status: ContentStatus; count: number }> = [];
  let examRows: Array<{ id: string; title: string; examFamily: ExamFamily; tier: TierCode; country: CountryCode; status: ContentStatus; updatedAt: Date }> = [];
  let qualityFlaggedQuestions: Array<{ id: string; tier: TierCode; topic: string; tags: string[]; stem: string }> = [];

  try {
    [
      lessonCount,
      questionCount,
      draftQuestions,
      reviewQuestions,
      jobPending,
      userCount,
      flashcardPublished,
      flashcardDecksPublished,
      examsPublished,
      totalBlogPosts,
      publishedBlogPosts,
      scheduledBlogPosts,
      nextScheduledBlog,
      blogRows,
      flashcardsByExamFamily,
      flashcardsByTier,
      flashcardsByCategory,
      lessonsByPathway,
      jobsRecent,
      presetInventory,
      examsByFamilyAndCountry,
      examRows,
      qualityFlaggedQuestions,
    ] = await Promise.all([
      prisma.contentItem.count({ where: { type: "lesson" } }),
      prisma.examQuestion.count(),
      prisma.examQuestion.count({ where: { status: "draft" } }),
      prisma.examQuestion.count({ where: { status: "published", rationale: null } }),
      prisma.backgroundJob.count({ where: { status: JobStatus.PENDING } }).catch(() => 0),
      prisma.user.count(),
      prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }).catch(() => 0),
      prisma.exam.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { postStatus: BlogPostStatus.PUBLISHED } }),
      prisma.blogPost.count({ where: { postStatus: BlogPostStatus.SCHEDULED } }),
      prisma.blogPost.findFirst({
        where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { not: null } },
        orderBy: { publishAt: "asc" },
        select: { publishAt: true },
      }),
      prisma.blogPost.findMany({
        orderBy: [{ publishAt: "asc" }, { updatedAt: "desc" }],
        take: 120,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          exam: true,
          category: true,
          tags: true,
          seoTitle: true,
          seoDescription: true,
          postStatus: true,
          publishAt: true,
          updatedAt: true,
        },
      }),
      prisma
        .$queryRaw<Array<{ examFamily: ExamFamily; cnt: bigint }>>`
          SELECT exam_family AS "examFamily", COUNT(*)::bigint AS cnt
          FROM flashcards
          GROUP BY exam_family
        `
        .then((rows) => rows.map((r) => ({ examFamily: r.examFamily, count: Number(r.cnt) }))),
      prisma
        .$queryRaw<Array<{ tier: TierCode; cnt: bigint }>>`
          SELECT tier, COUNT(*)::bigint AS cnt
          FROM flashcards
          GROUP BY tier
        `
        .then((rows) => rows.map((r) => ({ tier: r.tier, count: Number(r.cnt) }))),
      prisma
        .$queryRaw<Array<{ categoryId: string; cnt: bigint }>>`
          SELECT category_id AS "categoryId", COUNT(*)::bigint AS cnt
          FROM flashcards
          GROUP BY category_id
          ORDER BY cnt DESC
          LIMIT 20
        `
        .then((rows) => rows.map((r) => ({ categoryId: r.categoryId, count: Number(r.cnt) }))),
      prisma
        .$queryRaw<Array<{ pathwayId: string; status: ContentStatus; locale: string; cnt: bigint }>>`
          SELECT pathway_id AS "pathwayId", status, locale, COUNT(*)::bigint AS cnt
          FROM pathway_lessons
          GROUP BY pathway_id, status, locale
        `
        .then((rows) => rows.map((r) => ({ pathwayId: r.pathwayId, status: r.status, locale: r.locale, count: Number(r.cnt) }))),
      prisma.backgroundJob.findMany({
        orderBy: { createdAt: "desc" },
        take: 25,
        select: {
          id: true,
          type: true,
          status: true,
          createdAt: true,
          scheduledFor: true,
          attempts: true,
          lastError: true,
        },
      }),
      Promise.all(
        PRESET_TAGS.map(async (tag) => ({
          tag,
          count: await countPresetInventory(tag),
        })),
      ),
      prisma
        .$queryRaw<Array<{ examFamily: ExamFamily; country: CountryCode; status: ContentStatus; cnt: bigint }>>`
          SELECT exam_family AS "examFamily", country, status, COUNT(*)::bigint AS cnt
          FROM exams
          GROUP BY exam_family, country, status
        `
        .then((rows) =>
          rows.map((r) => ({ examFamily: r.examFamily, country: r.country, status: r.status, count: Number(r.cnt) })),
        ),
      prisma.exam.findMany({
        orderBy: { updatedAt: "desc" },
        take: 40,
        select: { id: true, title: true, examFamily: true, tier: true, country: true, status: true, updatedAt: true },
      }),
      prisma.examQuestion
        .findMany({
          where: { status: "published", tags: { hasSome: [...QUALITY_FLAG_TAGS] } },
          orderBy: { id: "asc" },
          take: 500,
          select: { id: true, tier: true, topic: true, tags: true, stem: true },
        })
        .then((rows) =>
          rows.map((r) => ({
            id: r.id,
            tier: r.tier as TierCode,
            topic: r.topic ?? "",
            tags: r.tags,
            stem: r.stem,
          })),
        ),
    ]);
  } catch {
    // Keep defaults and rendered diagnostics from builder fallbacks.
  }

  const t = stats?.totals;
  const missingBlogSeoCount = blogRows.filter((p) => !p.seoTitle?.trim() || !p.seoDescription?.trim() || !p.excerpt.trim()).length;

  const flashcardCategoryIds = flashcardsByCategory.map((c) => c.categoryId);
  const categoryNames = await withDatabaseFallback(
    () =>
      prisma.category.findMany({
        where: { id: { in: flashcardCategoryIds } },
        select: { id: true, name: true },
      }),
    [] as Array<{ id: string; name: string }>,
  );
  const categoryNameMap = new Map(categoryNames.map((c) => [c.id, c.name]));

  const lessonsByPathwayMap = new Map<string, { published: number; draft: number; locales: string[] }>();
  for (const row of lessonsByPathway) {
    const prev = lessonsByPathwayMap.get(row.pathwayId) ?? { published: 0, draft: 0, locales: [] };
    if (row.status === ContentStatus.PUBLISHED) prev.published += row.count;
    if (row.status === ContentStatus.DRAFT) prev.draft += row.count;
    if (!prev.locales.includes(row.locale)) prev.locales.push(row.locale);
    lessonsByPathwayMap.set(row.pathwayId, prev);
  }

  const flashcardsByFamilyMap = new Map<ExamFamily, number>();
  for (const row of flashcardsByExamFamily) flashcardsByFamilyMap.set(row.examFamily, row.count);

  const presetMap = new Map(presetInventory.map((p) => [p.tag, p.count]));

  const coverageRows = EXAM_PATHWAYS.filter(
    (p) => p.countryCode === CountryCode.US && (p.roleTrack === "rn" || p.roleTrack === "rpn" || p.roleTrack === "lpn"),
  ).map((p) => {
    const lessonStats = lessonsByPathwayMap.get(p.id) ?? { published: 0, draft: 0, locales: [] };
    const questionMatch =
      questionDiag?.pathwayPublishedMatch.find((m) => m.pathwayId === p.id)?.publishedCount ?? 0;
    const flashcards = flashcardsByFamilyMap.get(p.examFamily) ?? 0;
    const presetCount =
      p.examFamily === ExamFamily.NCLEX_RN
        ? (presetMap.get(EXAM_PRESET_RN_MIXED_2026_TAG) ?? 0) + (presetMap.get(EXAM_PRESET_US_RN_FULL_2026_TAG) ?? 0)
        : p.examFamily === ExamFamily.NCLEX_PN || p.examFamily === ExamFamily.REX_PN
          ? (presetMap.get(EXAM_PRESET_PN_MIXED_2026_TAG) ?? 0) + (presetMap.get(EXAM_PRESET_US_PN_FULL_2026_TAG) ?? 0)
          : 0;
    const readiness: "ready" | "partial" | "not_ready" =
      lessonStats.published >= 10 && questionMatch >= 200 && flashcards >= 150 && presetCount >= 20
        ? "ready"
        : lessonStats.published > 0 || questionMatch > 0 || flashcards > 0
          ? "partial"
          : "not_ready";
    return {
      pathwayId: p.id,
      displayName: p.displayName,
      roleBucket: pathwayBucket(p),
      country: p.countryCode,
      lessons: lessonStats.published,
      questions: questionMatch,
      flashcards,
      presetInventory: presetCount,
      readiness,
      locales: lessonStats.locales.join(", ") || "—",
    };
  });

  const api = [
    { href: "/api/admin/stats", label: "Platform stats (JSON)" },
    { href: "/api/admin/insights", label: "Insights JSON" },
    { href: "/api/admin/qa", label: "QA summary" },
    { href: "/api/admin/gaps", label: "Coverage gaps" },
    { href: "/api/admin/operations-dashboard", label: "Operations dashboard JSON" },
    { href: "/api/admin/scalability-report", label: "Scalability report JSON" },
    { href: "/api/admin/question-bank-diagnostics", label: "Question diagnostics JSON" },
    { href: "/api/admin/pathway-lesson-translations", label: "Pathway translation coverage JSON" },
    { href: "/api/admin/questions?page=1&pageSize=20", label: "Questions (paged)" },
    { href: "/api/admin/lessons?page=1&pageSize=20", label: "Lessons (paged)" },
    { href: "/api/admin/exams?page=1&pageSize=20", label: "Exams (paged)" },
    { href: "/api/admin/flashcards?page=1&pageSize=20", label: "Flashcards (paged)" },
    { href: "/api/admin/flashcards/summary", label: "Flashcards summary (JSON)" },
    { href: "/api/admin/jobs", label: "Background jobs" },
  ];

  const qualityRows = qualityFlaggedQuestions.map((q) => ({
    id: q.id,
    tier: q.tier,
    topic: q.topic,
    qualityFlags: q.tags.filter((tag) => QUALITY_FLAG_TAGS.includes(tag as (typeof QUALITY_FLAG_TAGS)[number])),
    stemPreview: q.stem.length > 120 ? `${q.stem.slice(0, 117)}…` : q.stem,
  }));
  const [
    mixedRnCount,
    mixedPnCount,
    mixedCatchAll,
    rnMixedCatchAll,
    pnMixedCatchAll,
    usRnFullCatchAll,
    usPnFullCatchAll,
  ] = await Promise.all([
    countPresetInventory(EXAM_PRESET_RN_MIXED_2026_TAG, ["rn"]),
    countPresetInventory(EXAM_PRESET_PN_MIXED_2026_TAG, ["rpn", "lvn"]),
    countPresetCatchAll("mixed-practice-2026-rn-pn"),
    countPresetCatchAll(EXAM_PRESET_RN_MIXED_2026_TAG),
    countPresetCatchAll(EXAM_PRESET_PN_MIXED_2026_TAG),
    countPresetCatchAll(EXAM_PRESET_US_RN_FULL_2026_TAG),
    countPresetCatchAll(EXAM_PRESET_US_PN_FULL_2026_TAG),
  ]);
  const presetValidationRows = [
    { tag: "mixed-practice-2026-rn-pn", poolSize: presetMap.get("mixed-practice-2026-rn-pn") ?? 0, catchAllRows: mixedCatchAll, target: 20 },
    { tag: EXAM_PRESET_RN_MIXED_2026_TAG, poolSize: presetMap.get(EXAM_PRESET_RN_MIXED_2026_TAG) ?? 0, catchAllRows: rnMixedCatchAll, target: 20 },
    { tag: EXAM_PRESET_PN_MIXED_2026_TAG, poolSize: presetMap.get(EXAM_PRESET_PN_MIXED_2026_TAG) ?? 0, catchAllRows: pnMixedCatchAll, target: 20 },
    { tag: EXAM_PRESET_US_RN_FULL_2026_TAG, poolSize: presetMap.get(EXAM_PRESET_US_RN_FULL_2026_TAG) ?? 0, catchAllRows: usRnFullCatchAll, target: 75 },
    { tag: EXAM_PRESET_US_PN_FULL_2026_TAG, poolSize: presetMap.get(EXAM_PRESET_US_PN_FULL_2026_TAG) ?? 0, catchAllRows: usPnFullCatchAll, target: 75 },
  ];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin operations dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Internal day-to-day controls for blog scheduling, content readiness, question bank quality, and ops jobs.
          </p>
        </div>
        {stats ? (
          <p className="text-xs text-muted-foreground">Updated {fmtTs(stats.generatedAt)}</p>
        ) : (
          <p className="text-xs text-amber-800">Stats unavailable — check database connectivity.</p>
        )}
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={t?.users ?? userCount} hint="All roles" />
        <MetricCard label="Learners" value={t?.learners ?? "—"} hint="Role LEARNER" />
        <MetricCard label="Active subscriptions" value={t?.activeSubscriptions ?? "—"} hint="ACTIVE + GRACE" />
        <MetricCard label="Conversion (free → paid)" value={fmtPct(t?.conversionRatePct ?? null)} hint="Learners with a subscription" />
        <MetricCard label="Content-item lessons (legacy)" value={lessonCount} hint="All statuses in content_items only" />
        <MetricCard label="Published lessons (app + pathway)" value={t?.lessonsTotal ?? "—"} hint="Combined live lesson inventory" />
        <MetricCard label="Pathway lessons (published)" value={t?.pathwayLessonsPublished ?? "—"} hint="DB pathway_lessons rows" />
        <MetricCard label="Total questions" value={questionCount} hint="All statuses" />
        <MetricCard label="Published questions" value={t?.questionsPublished ?? "—"} />
        <MetricCard label="Total flashcards" value={flashcardPublished} hint="Published only" />
        <MetricCard label="Published flashcard decks" value={flashcardDecksPublished} />
        <MetricCard label="Total blog posts" value={totalBlogPosts} />
        <MetricCard label="Published exam presets" value={examsPublished} />
        <MetricCard label="Jobs pending" value={jobPending} />
      </section>

      <section className="mt-8">
        <AdminBlogSchedulerPanel
          initialPosts={blogRows.map((p) => ({
            ...p,
            publishAt: p.publishAt ? p.publishAt.toISOString() : null,
            updatedAt: p.updatedAt.toISOString(),
          }))}
          counts={{ draft: totalBlogPosts - (publishedBlogPosts + scheduledBlogPosts), scheduled: scheduledBlogPosts, published: publishedBlogPosts }}
          nextScheduledAt={nextScheduledBlog?.publishAt ? nextScheduledBlog.publishAt.toISOString() : null}
          missingSeoCount={missingBlogSeoCount}
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Question bank oversight</h2>
          <p className="mt-1 text-sm text-muted-foreground">Coverage, duplicates, weak topics, and import-quality diagnostics.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <MetricMini label="Total imported questions" value={questionDiag?.totals.allRows ?? "—"} />
            <MetricMini label="Usable published questions" value={questionDiag?.totals.publishedRows ?? "—"} />
            <MetricMini label="Draft or excluded" value={questionDiag?.totals.draftOrOtherRows ?? "—"} />
            <MetricMini label="Duplicate stem groups" value={qaSnapshot?.duplicateStemHashGroups ?? "—"} />
            <MetricMini label="Needs review" value={qaSnapshot?.questionsFlaggedNeedsReview ?? reviewQuestions} />
            <MetricMini label="Invalid rationale flags" value={qaSnapshot?.questionsEmptyOrSuspiciousRationale ?? "—"} />
          </div>
          <h3 className="mt-5 text-sm font-semibold">Content depth (published, reporting)</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Word-count thresholds: rationales &lt;120w flagged thin; lessons &lt;500w thin (pathway/content sampled). JSON:{" "}
            <code className="rounded bg-muted px-1">GET /api/admin/content-quality</code>
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <MetricMini
              label="Published Q · thin rationale (&lt;120w)"
              value={contentQuality.examQuestionsPublished.rationaleThinWords}
            />
            <MetricMini
              label="Published Q · missing/empty rationale"
              value={contentQuality.examQuestionsPublished.rationaleMissingOrEmpty}
            />
            <MetricMini label="Published Q · OK rationale (≥120w)" value={contentQuality.examQuestionsPublished.rationaleAcceptableOrStrong} />
            <MetricMini label="Pathway lessons (total)" value={contentQuality.pathwayLessonsPublished.total} />
            <MetricMini label="Pathway sample · thin" value={contentQuality.pathwayLessonsPublished.sampleThin} />
            <MetricMini label="Pathway sample · strong" value={contentQuality.pathwayLessonsPublished.sampleStrong} />
            <MetricMini label="Content-item lessons (total)" value={contentQuality.contentItemLessonsPublished.total} />
            <MetricMini label="Content sample · thin" value={contentQuality.contentItemLessonsPublished.sampleThin} />
          </div>
          <h3 className="mt-5 text-sm font-semibold">Top weak topics (low count)</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {(questionDiag?.topicTopPublished ?? []).slice(-10).map((row) => (
              <li key={row.topic} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                <span className="truncate pr-2">{row.topic}</span>
                <span className="tabular-nums">{row.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Catch-all bucket check:{" "}
            {(questionDiag?.topicTopPublished ?? []).some((x) => x.topic.toLowerCase().includes("general-nursing-clinical"))
              ? "present"
              : "not found in current published topic sample"}
            .
          </p>
        </div>

        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Lessons oversight</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pathway lesson state, locale overlays, and related content signals.</p>
          <div className="mt-4 max-h-80 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="py-2">Pathway</th>
                  <th className="py-2 text-right">Published</th>
                  <th className="py-2 text-right">Draft</th>
                  <th className="py-2">Locales</th>
                </tr>
              </thead>
              <tbody>
                {coverageRows.map((r) => (
                  <tr key={r.pathwayId} className="border-b border-border/50">
                    <td className="py-1.5 pr-2">{r.displayName}</td>
                    <td className="py-1.5 text-right tabular-nums">{r.lessons}</td>
                    <td className="py-1.5 text-right tabular-nums">
                      {lessonsByPathwayMap.get(r.pathwayId)?.draft ?? 0}
                    </td>
                    <td className="py-1.5 text-[10px]">{r.locales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Pre-test / post-test flags are not first-class DB fields in current schema; this panel surfaces pathway status, locale overlays, and linked inventory instead.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <AdminQualityFlagReviewPanel rows={qualityRows} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Flashcards oversight</h2>
          <p className="mt-1 text-sm text-muted-foreground">Totals by exam family, tier, and top categories.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {flashcardsByExamFamily.map((row) => (
              <MetricMini key={row.examFamily} label={`Exam ${row.examFamily}`} value={row.count} />
            ))}
            {flashcardsByTier.map((row) => (
              <MetricMini key={row.tier} label={`Tier ${row.tier}`} value={row.count} />
            ))}
          </div>
          <h3 className="mt-5 text-sm font-semibold">Top categories</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {flashcardsByCategory.map((row) => (
              <li key={row.categoryId} className="flex justify-between rounded bg-muted/40 px-2 py-1">
                <span>{categoryNameMap.get(row.categoryId) ?? row.categoryId}</span>
                <span className="tabular-nums">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="nn-card p-6">
          <h2 className="text-lg font-semibold">Exam / practice presets</h2>
          <p className="mt-1 text-sm text-muted-foreground">Preset tag inventory + live Exam rows to validate runnable pools.</p>
          <div className="mt-4 max-h-80 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="py-2">Preset tag</th>
                  <th className="py-2 text-right">Questions</th>
                </tr>
              </thead>
              <tbody>
                {presetInventory.map((p) => (
                  <tr key={p.tag} className="border-b border-border/50">
                    <td className="py-1.5 font-mono">{p.tag}</td>
                    <td className="py-1.5 text-right tabular-nums">{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="mt-5 text-sm font-semibold">Recent exam rows</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {examRows.map((e) => (
              <li key={e.id} className="rounded bg-muted/40 px-2 py-1">
                {e.title} · {e.examFamily} · {e.tier} · {e.country} · {e.status}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Active state is currently represented by published status + question-pool availability.
          </p>
          <h3 className="mt-4 text-sm font-semibold">Preset validation (US RN/PN)</h3>
          <div className="mt-2 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="py-2">Preset tag</th>
                  <th className="py-2 text-right">Pool size</th>
                  <th className="py-2 text-right">Target</th>
                  <th className="py-2 text-right">Catch-all rows</th>
                  <th className="py-2">Validation</th>
                </tr>
              </thead>
              <tbody>
                {presetValidationRows.map((row) => {
                  const sizeOk = row.poolSize >= row.target;
                  const catchAllOk = row.target === 75 ? row.catchAllRows === 0 : true;
                  return (
                    <tr key={row.tag} className="border-b border-border/50">
                      <td className="py-1.5 font-mono">{row.tag}</td>
                      <td className="py-1.5 text-right tabular-nums">{row.poolSize}</td>
                      <td className="py-1.5 text-right tabular-nums">{row.target}</td>
                      <td className="py-1.5 text-right tabular-nums">{row.catchAllRows}</td>
                      <td className="py-1.5">{sizeOk && catchAllOk ? "pass" : "needs attention"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            RN/PN mixed draw balance: RN tag pool {mixedRnCount} vs PN tag pool {mixedPnCount}.
          </p>
          <h3 className="mt-4 text-sm font-semibold">Exam rows by family/country/status</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {examsByFamilyAndCountry.map((row) => (
              <li key={`${row.examFamily}-${row.country}-${row.status}`} className="rounded bg-muted/40 px-2 py-1">
                {row.examFamily} · {row.country} · {row.status}: {row.count}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Content coverage / readiness by pathway</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ready/partial/not_ready is computed from hard thresholds on real counts.</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Runtime source summary: {scalability?.pathwayLessons.summary.pathwaysWithDb ?? 0} DB-backed,{" "}
          {scalability?.pathwayLessons.summary.pathwaysCatalogOnly ?? 0} catalog fallback,{" "}
          {scalability?.pathwayLessons.summary.pathwaysEmpty ?? 0} empty pathways.
        </p>
        <div className="mt-4 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">Pathway</th>
                <th className="py-2">Bucket</th>
                <th className="py-2">Country</th>
                <th className="py-2 text-right">Lessons</th>
                <th className="py-2 text-right">Questions</th>
                <th className="py-2 text-right">Flashcards</th>
                <th className="py-2 text-right">Preset inventory</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {coverageRows.map((row) => (
                <tr key={row.pathwayId} className="border-b border-border/50">
                  <td className="py-1.5">{row.displayName}</td>
                  <td className="py-1.5">{row.roleBucket}</td>
                  <td className="py-1.5">{row.country}</td>
                  <td className="py-1.5 text-right tabular-nums">{row.lessons}</td>
                  <td className="py-1.5 text-right tabular-nums">{row.questions}</td>
                  <td className="py-1.5 text-right tabular-nums">{row.flashcards}</td>
                  <td className="py-1.5 text-right tabular-nums">{row.presetInventory}</td>
                  <td className="py-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${readinessLabel(row.readiness)}`}>
                      {row.readiness}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Thresholds: ready requires lessons ≥ 10, questions ≥ 200, flashcards ≥ 150, preset inventory ≥ 20.
        </p>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Recent jobs / operations</h2>
        <p className="mt-1 text-sm text-muted-foreground">Latest job outcomes and queue health from BackgroundJob rows.</p>
        <div className="mt-4 max-h-72 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="py-2">Type</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created</th>
                <th className="py-2">Scheduled</th>
                <th className="py-2 text-right">Attempts</th>
                <th className="py-2">Last error</th>
              </tr>
            </thead>
            <tbody>
              {jobsRecent.map((j) => (
                <tr key={j.id} className="border-b border-border/50">
                  <td className="py-1.5">{j.type}</td>
                  <td className="py-1.5">{j.status}</td>
                  <td className="py-1.5">{fmtTs(j.createdAt.toISOString())}</td>
                  <td className="py-1.5">{fmtTs(j.scheduledFor?.toISOString())}</td>
                  <td className="py-1.5 text-right tabular-nums">{j.attempts}</td>
                  <td className="py-1.5">{j.lastError ? j.lastError.slice(0, 80) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <AdminOpsActionsPanel />
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Question + lesson quality diagnostics</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricMini label="Draft questions" value={draftQuestions} />
          <MetricMini label="Needs review" value={reviewQuestions} />
          <MetricMini label="Duplicate stems" value={qaSnapshot?.duplicateStemHashGroups ?? "—"} />
          <MetricMini label="Lessons in draft" value={qaSnapshot?.lessonsInDraft ?? "—"} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Question topic coverage, pathway matching, and cross-tab breakdown come from the existing diagnostics builders.
        </p>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Existing admin tools surfaced</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>Blog scheduler runner: <code className="rounded bg-black/5 px-1">promoteScheduledBlogPosts()</code></li>
          <li>Background worker: <code className="rounded bg-black/5 px-1">processPendingJobs()</code></li>
          <li>Question diagnostics: <code className="rounded bg-black/5 px-1">buildQuestionBankCoverageReport()</code></li>
          <li>Coverage/scalability: <code className="rounded bg-black/5 px-1">buildContentScalabilityReport()</code></li>
          <li>QA snapshot: <code className="rounded bg-black/5 px-1">loadAdminQaIssueSnapshot()</code></li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">API quick links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {api.map((x) => (
            <li key={x.href}>
              <Link className="text-primary underline" href={x.href}>
                {x.label}
              </Link>
              <span className="ml-2 text-muted-foreground">{x.href}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <article className="nn-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
}

function MetricMini({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </article>
  );
}
