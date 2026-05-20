import Link from "next/link";

import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOsceStationsPage() {
  await requireAdmin();

  const populated = (await prisma.osceStation.count()) > 0;
  const rows = populated
    ? await prisma.osceStation.findMany({
        orderBy: { updatedAt: "desc" },
        take: 220,
        select: {
          id: true,
          slug: true,
          title: true,
          isPublished: true,
          category: true,
          difficulty: true,
          updatedAt: true,
          sourceLegacyPath: true,
        },
      })
    : [];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">OSCE stations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live learner and marketing OSCE pages read from <code className="rounded bg-muted px-1">osce_stations</code>{" "}
            when the table has rows. Unpublished rows are hidden from public routes. Legacy JSON fallback requires{" "}
            <code className="rounded bg-muted px-1">OSCE_LEGACY_FALLBACK=1</code> when the table is empty.
          </p>
        </div>
        <Link
          href="/api/admin/osce-stations"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          prefetch={false}
        >
          Raw JSON inventory
        </Link>
      </div>

      {!populated ? (
        <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          No rows in <code className="rounded bg-muted px-1">osce_stations</code> yet. Run the migration script from the
          repo docs, then refresh. Until then, public OSCE lists are empty unless legacy fallback is enabled.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Slug</th>
                <th className="px-3 py-2">Published</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Updated</th>
                <th className="px-3 py-2">Edit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/80 last:border-0">
                  <td className="px-3 py-2 font-medium">{r.title}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{r.slug}</td>
                  <td className="px-3 py-2">{r.isPublished ? "yes" : "no"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.category}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.updatedAt.toISOString().slice(0, 10)}</td>
                  <td className="px-3 py-2">
                    <Link className="font-medium text-primary underline-offset-4 hover:underline" href={`/admin/osce-stations/${r.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
