import { Suspense } from "react";
import Link from "next/link";
import { ContentStatus, CountryCode } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { buildQuestionBankCoverageReport } from "@/lib/questions/build-question-bank-diagnostics";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { loadContentQualitySnapshot } from "@/lib/admin/content-quality-snapshot";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

const ADMIN_CONTENT_DB_TIMEOUT_MS = 2000;

function AdminContentPageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Content & coverage</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pathway lessons vs question bank alignment (US registry sample).</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-primary underline">
          ← Overview
        </Link>
      </div>
      {children}
      <section className="mt-8 nn-card p-6">
        <h2 className="text-lg font-semibold">API tools</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link className="text-primary underline" href="/api/admin/question-bank-coverage">
              Question bank coverage
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/gaps">
              Topic gaps
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/lessons?page=1&pageSize=20">
              Lessons (paged)
            </Link>
          </li>
          <li>
            <Link className="text-primary underline" href="/api/admin/questions?page=1&pageSize=20">
              Questions (paged)
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

function AdminContentSectionFallback({ message }: { message: string }) {
  return (
    <section className="mt-8 nn-card p-6 text-sm text-[var(--semantic-text-secondary)]" role="status">
      {message}
    </section>
  );
}

async function AdminQualitySnapshotSection() {
  const cq = await loadContentQualitySnapshot().catch((error) => {
    safeServerLog("admin_content", "quality_snapshot_failed", {
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 180),
    });
    return null;
  });

  if (!cq) {
    return (
      <section className="mt-8 nn-card p-6 text-sm text-[var(--semantic-text-secondary)]" data-testid="admin-content-quality-fallback">
        Quality snapshot is temporarily unavailable while database reads recover.
      </section>
    );
  }

  return (
    <section className="mt-8 nn-card p-6">
      <h2 className="text-lg font-semibold">Quality snapshot</h2>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Thin rationales (&lt;120w)</p>
          <p className="text-xl font-bold">{cq.examQuestionsPublished.rationaleThinWords}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Missing rationale</p>
          <p className="text-xl font-bold">{cq.examQuestionsPublished.rationaleMissingOrEmpty}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Pathway lessons (pub)</p>
          <p className="text-xl font-bold">{cq.pathwayLessonsPublished.total}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Content-item lessons (pub)</p>
          <p className="text-xl font-bold">{cq.contentItemLessonsPublished.total}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Full JSON: <code className="rounded bg-muted px-1">GET /api/admin/content-quality</code>
      </p>
    </section>
  );
}

async function AdminInventorySection() {
  const [questionDiag, pathwayGroup] = await Promise.all([
    buildQuestionBankCoverageReport().catch((error) => {
      safeServerLog("admin_content", "question_coverage_failed", {
        detail: (error instanceof Error ? error.message : String(error)).slice(0, 180),
      });
      return null;
    }),
    withDatabaseFallbackTimeout(
      () =>
        prisma.pathwayLesson.groupBy({
          by: ["pathwayId", "status"],
          _count: { _all: true },
        }),
      [],
      ADMIN_CONTENT_DB_TIMEOUT_MS,
      { scope: "admin_content", label: "pathway_group_inventory" },
    ),
  ]);

  const pubByPathway = new Map<string, number>();
  const draftByPathway = new Map<string, number>();
  for (const row of pathwayGroup) {
    if (row.status === ContentStatus.PUBLISHED) {
      pubByPathway.set(row.pathwayId, (pubByPathway.get(row.pathwayId) ?? 0) + row._count._all);
    }
    if (row.status === ContentStatus.DRAFT) {
      draftByPathway.set(row.pathwayId, (draftByPathway.get(row.pathwayId) ?? 0) + row._count._all);
    }
  }

  const matchByPathway = new Map((questionDiag?.pathwayPublishedMatch ?? []).map((m) => [m.pathwayId, m.publishedCount]));
  const rows = EXAM_PATHWAYS.filter((p) => p.countryCode === CountryCode.US).map((p) => {
    const lessons = pubByPathway.get(p.id) ?? 0;
    const draft = draftByPathway.get(p.id) ?? 0;
    const q = matchByPathway.get(p.id) ?? 0;
    const readiness =
      lessons >= 10 && q >= 200 ? "ready" : lessons > 0 || q > 0 ? "partial" : "not_ready";
    return { ...p, lessons, draft, q, readiness };
  });

  const usingFallback = pathwayGroup.length === 0 && questionDiag == null;

  return (
    <section className="mt-8 nn-card p-6">
      <h2 className="text-lg font-semibold">Pathway × question inventory</h2>
      {usingFallback ? (
        <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
          Inventory counts are temporarily unavailable while database reads recover.
        </p>
      ) : null}
      <div className="mt-4 overflow-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2">Pathway</th>
              <th className="py-2 text-right">Lessons pub</th>
              <th className="py-2 text-right">Draft</th>
              <th className="py-2 text-right">Questions</th>
              <th className="py-2">Readiness</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/50">
                <td className="py-2">{r.displayName}</td>
                <td className="py-2 text-right tabular-nums">{r.lessons}</td>
                <td className="py-2 text-right tabular-nums">{r.draft}</td>
                <td className="py-2 text-right tabular-nums">{r.q}</td>
                <td className="py-2">{r.readiness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <AdminContentPageShell>
      <Suspense fallback={<AdminContentSectionFallback message="Loading quality snapshot…" />}>
        <AdminQualitySnapshotSection />
      </Suspense>
      <Suspense fallback={<AdminContentSectionFallback message="Loading pathway inventory…" />}>
        <AdminInventorySection />
      </Suspense>
    </AdminContentPageShell>
  );
}
