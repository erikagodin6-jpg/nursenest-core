import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { ContentStatus, JobStatus } from "@prisma/client";

function fmtPct(n: number | null) {
  if (n === null) return "—";
  return `${n}%`;
}

function fmtTs(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export default async function AdminPage() {
  await requireAdmin();

  const stats = await loadAdminDashboardStats();

  const [
    lessonCount,
    questionCount,
    draftQuestions,
    reviewQuestions,
    jobPending,
    userCount,
    flashcardPublished,
    flashcardDecksPublished,
    examsPublished,
  ] = await withDatabaseFallback(
    () =>
      Promise.all([
        prisma.contentItem.count({ where: { type: "lesson" } }),
        prisma.examQuestion.count(),
        prisma.examQuestion.count({ where: { status: "draft" } }),
        prisma.examQuestion.count({ where: { status: "published", rationale: null } }),
        prisma.backgroundJob.count({ where: { status: JobStatus.PENDING } }).catch(() => 0),
        prisma.user.count(),
        prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
        prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }).catch(() => 0),
        prisma.exam.count({ where: { status: ContentStatus.PUBLISHED } }),
      ]),
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  );

  const api = [
    { href: "/api/admin/stats", label: "Platform stats (JSON)" },
    { href: "/api/admin/insights", label: "Insights JSON" },
    { href: "/api/admin/qa", label: "QA summary" },
    { href: "/api/admin/gaps", label: "Coverage gaps" },
    { href: "/api/admin/questions?page=1&pageSize=20", label: "Questions (paged)" },
    { href: "/api/admin/lessons?page=1&pageSize=20", label: "Lessons (paged)" },
    { href: "/api/admin/exams?page=1&pageSize=20", label: "Exams (paged)" },
    { href: "/api/admin/flashcards", label: "Flashcards" },
    { href: "/api/admin/flashcards/summary", label: "Flashcards summary (JSON)" },
    { href: "/api/admin/flashcards/decks", label: "POST create deck (admin)" },
    { href: "/api/admin/jobs", label: "Background jobs" },
    { href: "/api/admin/export/content?take=100", label: "Export sample" },
  ];

  const t = stats?.totals;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform health and engagement — aggregate queries only; tables show recent rows (bounded).
          </p>
        </div>
        {stats ? (
          <p className="text-xs text-muted-foreground">Updated {fmtTs(stats.generatedAt)}</p>
        ) : (
          <p className="text-xs text-amber-800">Stats bundle unavailable — check database connectivity.</p>
        )}
      </div>

      {/* Primary metrics */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={t?.users ?? userCount} hint="All roles" />
        <MetricCard label="Learners" value={t?.learners ?? "—"} hint="Role LEARNER" />
        <MetricCard
          label="Active subscriptions"
          value={t?.activeSubscriptions ?? "—"}
          hint="ACTIVE + GRACE"
        />
        <MetricCard label="DAU (24h)" value={t?.dailyActiveUsers ?? "—"} hint="Unique learners with attempt, session, or progress" />
        <MetricCard
          label="Conversion (free → paid)"
          value={fmtPct(t?.conversionRatePct ?? null)}
          hint="Learners with ≥1 subscription / all learners"
        />
        <MetricCard
          label="Questions (published)"
          value={t?.questionsPublished ?? questionCount}
          hint="Exam question bank"
        />
        <MetricCard label="Lessons (total)" value={t?.lessonsTotal ?? "—"} hint="App lessons + pathway lessons (published)" />
        <MetricCard label="Flashcards (published)" value={t?.flashcardsPublished ?? flashcardPublished} />
        <MetricCard
          label="Flashcard decks (published)"
          value={flashcardDecksPublished}
          hint="Learner deck browser"
        />
      </section>

      {t ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Lessons breakdown: {t.appLessonsPublished} app (content_items) + {t.pathwayLessonsPublished} pathway (DB) ={" "}
          {t.lessonsTotal}. Learners ever subscribed: {t.learnersEverSubscribed}.
        </p>
      ) : null}

      {/* Question breakdown */}
      {stats ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="nn-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold">Question bank by tier (published)</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Aggregated from exam_questions.tier</p>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-5">
              {(["RN", "PN", "NP", "Allied", "Other"] as const).map((k) => (
                <div key={k} className="rounded-lg bg-muted/50 px-3 py-2 text-center">
                  <p className="text-2xl font-bold tabular-nums">{stats.questionsByTierBucket[k]}</p>
                  <p className="text-xs font-medium text-muted-foreground">{k}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="nn-card overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold">Questions by exam label (published)</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Top exams by count (max 40)</p>
            </div>
            <div className="max-h-64 overflow-auto p-5">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Exam</th>
                    <th className="pb-2 text-right font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.questionsByExam.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="py-4 text-muted-foreground">
                        No rows
                      </td>
                    </tr>
                  ) : (
                    stats.questionsByExam.map((row) => (
                      <tr key={row.exam} className="border-b border-border/60 last:border-0">
                        <td className="py-2 pr-2 font-mono text-xs">{row.exam}</td>
                        <td className="py-2 text-right tabular-nums">{row.count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}

      {/* Tables */}
      {stats ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <DataTable
            title="Recent users"
            subtitle="By profile updatedAt"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
              { key: "updatedAt", label: "Updated" },
            ]}
            rows={stats.recentUsers.map((u) => ({
              name: u.name,
              email: u.email,
              role: u.role,
              updatedAt: fmtTs(u.updatedAt),
            }))}
          />
          <DataTable
            title="Recent signups"
            subtitle="Learners by createdAt"
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "createdAt", label: "Joined" },
            ]}
            rows={stats.recentSignups.map((u) => ({
              name: u.name,
              email: u.email,
              createdAt: fmtTs(u.createdAt),
            }))}
          />
          <DataTable
            title="Recent purchases"
            subtitle="Subscription rows by createdAt"
            columns={[
              { key: "userEmail", label: "User" },
              { key: "status", label: "Status" },
              { key: "planTier", label: "Plan tier" },
              { key: "createdAt", label: "Created" },
            ]}
            rows={stats.recentPurchases.map((s) => ({
              userEmail: s.userEmail,
              status: s.status,
              planTier: s.planTier ?? "—",
              createdAt: fmtTs(s.createdAt),
            }))}
          />
        </section>
      ) : null}

      {/* Legacy ops strip */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="nn-card p-5">
          <p className="text-sm text-muted-foreground">All lessons (incl. draft)</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{lessonCount}</p>
        </article>
        <article className="nn-card p-5">
          <p className="text-sm text-muted-foreground">All questions</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{questionCount}</p>
        </article>
        <article className="nn-card p-5">
          <p className="text-sm text-muted-foreground">Published exams</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{examsPublished}</p>
        </article>
        <article className="nn-card p-5">
          <p className="text-sm text-muted-foreground">Jobs pending</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{jobPending}</p>
        </article>
        <article className="nn-card p-5">
          <p className="text-sm text-muted-foreground">Draft questions</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{draftQuestions}</p>
        </article>
        <article className="nn-card p-5">
          <p className="text-sm text-muted-foreground">Needs review</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{reviewQuestions}</p>
        </article>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Background jobs</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pending: {jobPending}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Schedule <code className="rounded bg-black/5 px-1">POST /api/cron/jobs</code> with{" "}
          <code className="rounded bg-black/5 px-1">Authorization: Bearer $CRON_SECRET</code> to drain the queue.
        </p>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">AI → draft pipeline</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review-first: drafts live in Prisma draft tables until promoted. Set{" "}
          <code className="rounded bg-black/5 px-1">AI_ADMIN_GENERATION_ENABLED=true</code>.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link className="text-primary underline" href="/admin/ai/exam-questions">
              Exam question batch
            </Link>
            <span className="ml-2 text-muted-foreground">/api/admin/ai/exam-questions/generate</span>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/ai/flashcards">
              Flashcard batch
            </Link>
            <span className="ml-2 text-muted-foreground">/api/admin/ai/flashcards/generate</span>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/ai/review">
              Review queue
            </Link>
            <span className="ml-2 text-muted-foreground">approve → promote</span>
          </li>
        </ul>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Translations (i18n)</h2>
        <p className="mt-1 text-sm text-muted-foreground">Live diagnostics from the report builder.</p>
        <Link className="mt-3 inline-flex text-primary underline" href="/admin/i18n">
          Open i18n diagnostics dashboard →
        </Link>
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

      <section className="mt-8 nn-card p-6 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Scale notes</h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Admin access requires session role ADMIN (see ensure-admin / requireAdmin).</li>
          <li>
            <code className="rounded bg-black/5 px-1">GET /api/admin/stats</code> uses a 60s in-memory cache; dashboard page loads
            fresh aggregates each request.
          </li>
          <li>Heavy work runs via BackgroundJob + cron worker.</li>
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

function DataTable<T extends Record<string, string>>({
  title,
  subtitle,
  columns,
  rows,
}: {
  title: string;
  subtitle: string;
  columns: { key: keyof T & string; label: string }[];
  rows: T[];
}) {
  return (
    <div className="nn-card overflow-hidden p-0">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="max-h-80 overflow-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((c) => (
                <th key={c.key} className="px-3 py-2 font-medium text-muted-foreground">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-muted-foreground">
                  No rows
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  {columns.map((c) => (
                    <td key={c.key} className="max-w-[10rem] truncate px-3 py-2 align-top">
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
