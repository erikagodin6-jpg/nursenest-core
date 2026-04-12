import Link from "next/link";
import { CountryCode, TierCode } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminContentCoverageFilters } from "@/components/admin/admin-content-coverage-filters";
import { loadAdminContentCoverageDashboard } from "@/lib/admin/load-admin-content-coverage-dashboard";
import { RELATED_EXAM_QUESTIONS_MIN_TARGET } from "@/lib/lessons/lesson-question-cross-links";

export const dynamic = "force-dynamic";

function parseCountry(raw: string | undefined): CountryCode | "ALL" {
  if (raw === "US" || raw === "CA") return raw as CountryCode;
  return "ALL";
}

function parseTier(raw: string | undefined): TierCode | "ALL" {
  if (raw === "RPN" || raw === "LVN_LPN" || raw === "RN" || raw === "NP" || raw === "ALLIED") return raw as TierCode;
  return "ALL";
}

export default async function AdminContentCoveragePage({
  searchParams,
}: {
  searchParams?: Promise<{ country?: string; tier?: string; exam?: string; bodySystem?: string }>;
}) {
  await requireAdmin();
  const sp = (await searchParams) ?? {};
  const filter = {
    country: parseCountry(sp.country),
    tier: parseTier(sp.tier),
    exam: (sp.exam?.trim() || "ALL") as string | "ALL",
    bodySystem: (sp.bodySystem?.trim() || "ALL") as string | "ALL",
  };

  const data = await loadAdminContentCoverageDashboard(filter);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Content</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Coverage dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Lesson counts by country and tier, pathway-scoped questions by topic, sampled lesson–bank links (≥{" "}
            {RELATED_EXAM_QUESTIONS_MIN_TARGET} matches), and a heuristic for questions that do not align to any lesson
            topic string. Readiness blends scale targets, bank size, and link sampling.
          </p>
        </div>
        <Link href="/admin/inventory" className="text-sm font-semibold text-primary underline">
          Inventory →
        </Link>
      </div>

      <div className="mt-6">
        <AdminContentCoverageFilters
          country={filter.country === "ALL" ? "ALL" : filter.country}
          tier={filter.tier === "ALL" ? "ALL" : filter.tier}
          exam={filter.exam === "ALL" ? "ALL" : filter.exam}
          bodySystem={filter.bodySystem === "ALL" ? "" : filter.bodySystem}
        />
      </div>

      {data.degraded ? (
        <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Partial data: one or more database aggregates failed. Refresh or check connectivity.
        </p>
      ) : null}

      <p className="mt-4 text-xs text-muted-foreground">Generated {data.generatedAt}</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pathways (filter)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{data.pathwaysMatched}</p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Published EN lessons</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {data.totalPublishedLessonsEn}
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sample: zero bank links</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {data.lessonsWithNoQuestions.countZero}{" "}
            <span className="text-sm font-normal text-muted-foreground">/ {data.lessonsWithNoQuestions.scanned}</span>
          </p>
        </div>
        <div className="nn-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Topic-mismatch questions (est.)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">
            {data.questionsWithNoLessonTopicMatch.count}
          </p>
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="nn-card overflow-hidden p-0">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Lessons per country</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                {data.lessonsPerCountry.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground">No rows</td>
                  </tr>
                ) : (
                  data.lessonsPerCountry.map((r) => (
                    <tr key={r.country} className="border-b border-border/50">
                      <td className="px-4 py-2">{r.country}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{r.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="nn-card overflow-hidden p-0">
          <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">Lessons per tier</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                {data.lessonsPerTier.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground">No rows</td>
                  </tr>
                ) : (
                  data.lessonsPerTier.map((r) => (
                    <tr key={r.tier} className="border-b border-border/50">
                      <td className="px-4 py-2">{r.tier}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{r.count}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="mt-10 nn-card overflow-hidden p-0">
        <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">
          Published questions by topic (pathway exam keys in filter)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Topic</th>
                <th className="px-4 py-2 text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.questionsByTopic.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-muted-foreground">
                    No topics (empty exam union or no published rows).
                  </td>
                </tr>
              ) : (
                data.questionsByTopic.map((r) => (
                  <tr key={r.topic} className="border-b border-border/50">
                    <td className="px-4 py-2 font-mono text-xs">{r.topic}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{r.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 nn-card overflow-hidden p-0">
        <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">
          Readiness by pathway (score0–100)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Pathway</th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Tier</th>
                <th className="px-4 py-2 text-right">EN lessons</th>
                <th className="px-4 py-2 text-right">Effective</th>
                <th className="px-4 py-2 text-right">Questions</th>
                <th className="px-4 py-2 text-right">% lessons ≥ min (sample)</th>
                <th className="px-4 py-2 text-right">Score</th>
                <th className="px-4 py-2">Label</th>
              </tr>
            </thead>
            <tbody>
              {data.pathwayReadiness.map((r) => (
                <tr key={r.pathwayId} className="border-b border-border/50">
                  <td className="px-4 py-2 font-medium">{r.displayName}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.countryCode}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.stripeTier}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.publishedLessonsEn}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.effectiveLessons}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{r.pathwayPublishedQuestions}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {r.pctLessonsMeetingMinQuestions != null ? `${r.pctLessonsMeetingMinQuestions}%` : "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums">{r.readinessScore}</td>
                  <td className="px-4 py-2 capitalize">{r.readinessLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 nn-card p-4">
        <h2 className="text-sm font-semibold">Lessons with no bank matches (sample)</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Predicate matches <code className="rounded bg-muted px-1">countRelatedExamQuestionsForPathwayLesson</code> — first{" "}
          {data.lessonsWithNoQuestions.scanned} lessons in filter.
        </p>
        <ul className="mt-3 max-h-60 list-inside list-disc space-y-1 overflow-y-auto text-sm">
          {data.lessonsWithNoQuestions.sample.length === 0 ? (
            <li className="text-muted-foreground">None in sample.</li>
          ) : (
            data.lessonsWithNoQuestions.sample.map((x) => (
              <li key={`${x.pathwayId}:${x.slug}`}>
                <span className="font-mono text-xs">{x.pathwayId}</span> · {x.slug} — {x.title}
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-muted/20 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Notes</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {data.notes.map((n) => (
            <li key={n.slice(0, 80)}>{n}</li>
          ))}
        </ul>
        <p className="mt-3">{data.questionsWithNoLessonTopicMatch.note}</p>
      </section>
    </main>
  );
}
