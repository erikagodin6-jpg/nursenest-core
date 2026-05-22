import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { buildAdminPathwayLessonStableEditHref } from "@/lib/admin/pathway-lesson-stable-edit-href";

export const dynamic = "force-dynamic";

export default async function AdminPathwayLessonsIndexPage() {
  await requireAdmin();

  let rows: Awaited<ReturnType<typeof prisma.pathwayLesson.findMany>> = [];
  try {
    rows = await prisma.pathwayLesson.findMany({
      where: { locale: "en" },
      select: {
        id: true,
        pathwayId: true,
        slug: true,
        title: true,
        status: true,
        locale: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 80,
    });
  } catch {
    rows = [];
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pathway lessons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Canonical marketing + learner pathway content lives in <code className="rounded bg-muted px-1">pathway_lessons</code>.
            Use <Link href="/admin/lessons">ContentItem lessons</Link> only for non-pathway / legacy CMS rows.
          </p>
        </div>
      </div>

      <form
        action="/admin/pathway-lessons/open"
        method="get"
        className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/20 p-4"
      >
        <p className="w-full text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open by pathway + slug</p>
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-muted-foreground">
          pathwayId
          <input
            name="pathwayId"
            required
            className="rounded-md border border-border bg-background px-2 py-2 font-mono text-sm"
            placeholder="e.g. us-rn-nclex-rn"
          />
        </label>
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-xs font-medium text-muted-foreground">
          slug
          <input
            name="slug"
            required
            className="rounded-md border border-border bg-background px-2 py-2 font-mono text-sm"
            placeholder="lesson slug"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Open editor
        </button>
      </form>

      <ul className="divide-y rounded-lg border">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <Link href={`/admin/pathway-lessons/${r.id}`} className="font-medium text-primary hover:underline">
                  {r.title}
                </Link>
                <span className="text-xs text-muted-foreground">·</span>
                <Link href={`/admin/pathway-lessons/open?pathwayId=${encodeURIComponent(r.pathwayId)}&slug=${encodeURIComponent(r.slug)}`} className="text-xs font-semibold text-primary hover:underline">
                  Open
                </Link>
                <span className="text-xs text-muted-foreground">·</span>
                <Link
                  href={buildAdminPathwayLessonStableEditHref({
                    pathwayId: r.pathwayId,
                    slug: r.slug,
                    locale: r.locale,
                  })}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Edit
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                {r.pathwayId} · {r.slug} · {r.status}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{r.updatedAt.toISOString().slice(0, 10)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
