import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { ContentStatus, JobStatus } from "@prisma/client";

export default async function AdminPage() {
  await requireAdmin();

  const [
    lessonCount,
    questionCount,
    draftQuestions,
    reviewQuestions,
    jobPending,
    userCount,
    flashcardPublished,
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
        prisma.exam.count({ where: { status: ContentStatus.PUBLISHED } }),
      ]),
    [0, 0, 0, 0, 0, 0, 0, 0],
  );

  const api = [
    { href: "/api/admin/insights", label: "Insights JSON" },
    { href: "/api/admin/qa", label: "QA summary" },
    { href: "/api/admin/gaps", label: "Coverage gaps" },
    { href: "/api/admin/questions?page=1&pageSize=20", label: "Questions (paged)" },
    { href: "/api/admin/lessons?page=1&pageSize=20", label: "Lessons (paged)" },
    { href: "/api/admin/exams?page=1&pageSize=20", label: "Exams (paged)" },
    { href: "/api/admin/flashcards", label: "Flashcards" },
    { href: "/api/admin/jobs", label: "Background jobs" },
    { href: "/api/admin/export/content?take=100", label: "Export sample" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Operations & content</h1>
      <p className="mt-2 text-muted">
        Admin APIs are authenticated (ADMIN role). Use these endpoints from your CMS, scripts, or API client — wire a richer UI when
        ready without changing learner flows.
      </p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Users</p>
          <p className="mt-1 text-3xl font-bold">{userCount}</p>
        </article>
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Lessons</p>
          <p className="mt-1 text-3xl font-bold">{lessonCount}</p>
        </article>
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Questions</p>
          <p className="mt-1 text-3xl font-bold">{questionCount}</p>
        </article>
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Published exams</p>
          <p className="mt-1 text-3xl font-bold">{examsPublished}</p>
        </article>
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Published flashcards</p>
          <p className="mt-1 text-3xl font-bold">{flashcardPublished}</p>
        </article>
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Draft questions</p>
          <p className="mt-1 text-3xl font-bold">{draftQuestions}</p>
        </article>
        <article className="nn-card p-6">
          <p className="text-sm text-muted">Needs review</p>
          <p className="mt-1 text-3xl font-bold">{reviewQuestions}</p>
        </article>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Background jobs</h2>
        <p className="mt-1 text-sm text-muted">Pending: {jobPending}</p>
        <p className="mt-2 text-sm text-muted">
          Schedule <code className="rounded bg-black/5 px-1">POST /api/cron/jobs</code> with{" "}
          <code className="rounded bg-black/5 px-1">Authorization: Bearer $CRON_SECRET</code> to drain the queue.
        </p>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">AI → draft pipeline</h2>
        <p className="mt-1 text-sm text-muted">
          Review-first: drafts live in Prisma draft tables until promoted. Set{" "}
          <code className="rounded bg-black/5 px-1">AI_ADMIN_GENERATION_ENABLED=true</code>.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link className="text-primary underline" href="/admin/ai/exam-questions">
              Exam question batch
            </Link>
            <span className="ml-2 text-muted">/api/admin/ai/exam-questions/generate</span>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/ai/flashcards">
              Flashcard batch
            </Link>
            <span className="ml-2 text-muted">/api/admin/ai/flashcards/generate</span>
          </li>
          <li>
            <Link className="text-primary underline" href="/admin/ai/review">
              Review queue
            </Link>
            <span className="ml-2 text-muted">approve → promote to Question / Flashcard (DRAFT)</span>
          </li>
        </ul>
      </section>

      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">Translations (i18n)</h2>
        <p className="mt-1 text-sm text-muted">
          Live diagnostics from the monolith report builder (missing keys, drift, compile status).
        </p>
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
              <span className="ml-2 text-muted">{x.href}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 nn-card p-6 text-sm text-muted">
        <h2 className="text-base font-semibold text-foreground">Scale notes</h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Content uses ContentStatus + exam family + tags; publish validates rationales and option shapes.</li>
          <li>Heavy work runs via BackgroundJob + cron worker (retries + failure states).</li>
          <li>Admin list endpoints paginate; export uses cursor pagination.</li>
          <li>Separate dev/staging/prod via DATABASE_URL and CRON_SECRET — never share production DB credentials.</li>
        </ul>
      </section>
    </main>
  );
}
