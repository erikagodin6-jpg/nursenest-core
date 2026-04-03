import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";

export const dynamic = "force-dynamic";

export default async function AdminNclexClientNeedsMappingPage() {
  await requireAdmin();
  const published = contentStatusToDb(ContentStatus.PUBLISHED);
  const [totalPublished, withCategory, withSubcategory] = await Promise.all([
    prisma.examQuestion.count({ where: { status: published } }),
    prisma.examQuestion.count({
      where: {
        status: published,
        nclexClientNeedsCategory: { not: null },
        NOT: { nclexClientNeedsCategory: "" },
      },
    }),
    prisma.examQuestion.count({
      where: {
        status: published,
        nclexClientNeedsSubcategory: { not: null },
        NOT: { nclexClientNeedsSubcategory: "" },
      },
    }),
  ]);
  const missingCategory = totalPublished - withCategory;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Question bank</p>
      <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">NCLEX client-needs mapping</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Published items only. Use this queue to prioritize backfilling{" "}
        <code className="rounded bg-muted px-1 text-xs">nclex_client_needs_category</code> and{" "}
        <code className="rounded bg-muted px-1 text-xs">nclex_client_needs_subcategory</code> for CAT blueprint
        diagnostics.
      </p>

      <ul className="mt-6 space-y-2 rounded-xl border border-border/70 bg-[var(--theme-card-bg)] p-4 text-sm">
        <li>
          <span className="font-semibold text-foreground">Published total:</span>{" "}
          <span className="tabular-nums">{totalPublished.toLocaleString()}</span>
        </li>
        <li>
          <span className="font-semibold text-foreground">With category:</span>{" "}
          <span className="tabular-nums">{withCategory.toLocaleString()}</span>
        </li>
        <li>
          <span className="font-semibold text-foreground">Missing category:</span>{" "}
          <span className="tabular-nums">{missingCategory.toLocaleString()}</span>
        </li>
        <li>
          <span className="font-semibold text-foreground">With subcategory:</span>{" "}
          <span className="tabular-nums">{withSubcategory.toLocaleString()}</span>
        </li>
      </ul>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <a
          className="rounded-lg border border-border bg-primary/10 px-4 py-2 font-semibold text-primary hover:bg-primary/15"
          href="/api/admin/nclex-client-needs-mapping?missingOnly=1&limit=200&format=json"
          target="_blank"
          rel="noreferrer"
        >
          JSON (missing category)
        </a>
        <a
          className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted"
          href="/api/admin/nclex-client-needs-mapping?missingField=subcategory&limit=200&format=json"
          target="_blank"
          rel="noreferrer"
        >
          JSON (missing subcategory)
        </a>
        <a
          className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted"
          href="/api/admin/nclex-client-needs-mapping?missingField=both&limit=200&format=json"
          target="_blank"
          rel="noreferrer"
        >
          JSON (category or subcategory gap)
        </a>
        <a
          className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted"
          href="/api/admin/nclex-client-needs-mapping?missingOnly=1&limit=500&format=csv"
        >
          CSV (missing category)
        </a>
        <a
          className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted"
          href="/api/admin/nclex-client-needs-mapping?missingField=subcategory&limit=500&format=csv"
        >
          CSV (missing subcategory)
        </a>
        <a
          className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted"
          href="/api/admin/nclex-client-needs-mapping?limit=50&format=json"
        >
          JSON (any sample)
        </a>
      </div>

      <p className="mt-4 text-sm">
        <Link className="font-semibold text-primary underline" href="/admin/diagnostics/cat-blueprint-sessions">
          CAT blueprint session diagnostics (completed runs)
        </Link>
      </p>

      <p className="mt-6 text-sm text-muted-foreground">
        Editing these fields in-app is not included here; use your CMS, SQL, or import pipeline. CAT reports expose{" "}
        <code className="rounded bg-muted px-1 text-xs">blueprintAdminDiagnostics</code> on completed adaptive runs for
        ops review.
      </p>

      <p className="mt-4">
        <Link href="/admin/questions" className="text-sm font-semibold text-primary underline">
          ← Question bank admin
        </Link>
      </p>
    </main>
  );
}
