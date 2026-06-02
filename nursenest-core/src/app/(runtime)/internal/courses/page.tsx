import type { Metadata } from "next";
import Link from "next/link";
import { requireInternalCoursesSurfaceAccess } from "@/lib/auth/guards";
import {
  listInternalCourseSummariesForSurface,
  type InternalCourseListRow,
} from "@/lib/internal-courses/load-internal-courses";
import { internalCourseRowVisibleOnInternalSurface } from "@/lib/internal-courses/surface-visibility";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internal courses",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

function statusBadgeClass(status: InternalCourseListRow["status"]): string {
  switch (status) {
    case "draft":
      return "nn-badge-semantic-warning";
    case "internal":
      return "nn-badge-semantic-info";
    case "published":
      return "nn-badge-semantic-success";
    default:
      return "nn-badge-semantic-info";
  }
}

export default async function InternalCoursesIndexPage() {
  const { staff } = await requireInternalCoursesSurfaceAccess("/internal/courses");
  const rows = await listInternalCourseSummariesForSurface();
  const visible = rows.filter((r) => internalCourseRowVisibleOnInternalSurface(staff, r.status));

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Internal</p>
        <h1 className="text-2xl font-semibold tracking-tight">Interactive course labs</h1>
        <p className="text-sm text-muted-foreground">
          Staff-only or dev-gated surface. Not indexed for search. Canonical lesson bodies stay in pathway
          lessons; these rows are interactive drills only.
        </p>
        {!staff && process.env.NN_INTERNAL_COURSES_DEV === "1" ? (
          <p className="rounded-md border border-[color-mix(in_srgb,var(--semantic-warning)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,transparent)] px-3 py-2 text-xs text-muted-foreground">
            Dev preview: <code className="rounded bg-muted/50 px-1">published</code> courses are hidden here
            until you are staff.
          </p>
        ) : null}
      </div>

      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/app">
          Back to app
        </Link>
        {staff ? (
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/admin/courses">
            Admin: course status
          </Link>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          No courses visible for your account. Run{" "}
          <code className="rounded bg-muted px-1">npm run db:seed-internal-courses</code> after migrations, or ask
          staff to grant access.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((c) => (
            <li
              key={c.id}
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,transparent)] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/internal/courses/${c.id}`}
                    className="font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    {c.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">{c.code}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    pathways: {c.pathwayIds.join(", ") || "—"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(c.status)}`}
                >
                  {c.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
