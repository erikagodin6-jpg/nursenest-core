import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPathwayLessonsIndexPage() {
  await requireAdmin();

  const rows = await prisma.pathwayLesson.findMany({
    where: { locale: "en" },
    select: {
      id: true,
      pathwayId: true,
      slug: true,
      title: true,
      status: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 80,
  });

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

      <ul className="divide-y rounded-lg border">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div>
              <Link href={`/admin/pathway-lessons/${r.id}`} className="font-medium text-primary hover:underline">
                {r.title}
              </Link>
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
