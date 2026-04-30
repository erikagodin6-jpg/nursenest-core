import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { InternalCourseStatusControl } from "@/components/admin/internal-course-status-control";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminInternalCoursesPage() {
  await requireAdmin();

  const rows = await prisma.internalCourse.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: {
      id: true,
      code: true,
      title: true,
      status: true,
      pathwayIds: true,
      updatedAt: true,
      _count: { select: { modules: true } },
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Internal courses</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            DB-backed interactive labs (ECG, ABC drills). Toggle draft / internal / published. The{" "}
            <code className="rounded bg-muted px-1">published</code> status remains staff-only on{" "}
            <Link className="font-semibold text-primary underline" href="/internal/courses">
              /internal/courses
            </Link>{" "}
            for non-staff dev previews.
          </p>
        </div>
        <Link
          href="/internal/courses"
          className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          Open internal labs
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          No rows yet. Run <code className="rounded bg-muted px-1">npm run db:seed-internal-courses</code> after
          migrations.
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{r.title}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {r.code} · {r._count.modules} modules
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  pathways: {r.pathwayIds.join(", ") || "—"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{r.updatedAt.toISOString().slice(0, 10)}</p>
              </div>
              <InternalCourseStatusControl courseId={r.id} initialStatus={r.status} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
