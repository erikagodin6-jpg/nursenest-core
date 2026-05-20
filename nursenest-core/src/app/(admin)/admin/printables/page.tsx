import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { isPrintableAdminApiAllowed } from "@/lib/printables/printable-store-flags";

export const dynamic = "force-dynamic";

export default async function AdminPrintablesIndexPage() {
  await requireAdmin();

  if (!isPrintableAdminApiAllowed()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-sm text-muted-foreground">
        <h1 className="text-lg font-semibold text-foreground">Printout store</h1>
        <p className="mt-2">
          Printable admin is disabled. Set <code className="rounded bg-muted px-1">ADMIN_PRINTABLES_ENABLED=true</code>{" "}
          while <code className="rounded bg-muted px-1">PRINTABLE_STORE_ENABLED=false</code> to manage drafts, or enable
          the learner store.
        </p>
      </main>
    );
  }

  const rows = await prisma.printableProduct.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: {
      id: true,
      slug: true,
      title: true,
      isPublished: true,
      isFree: true,
      isPremiumIncluded: true,
      pathwayId: true,
      updatedAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Printout store</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            PDFs live in Media / Spaces (<code className="rounded bg-muted px-1">MediaAsset</code>). Create rows via API
            or wire uploads from the{" "}
            <Link className="underline" href="/admin/media">
              media library
            </Link>
            .
          </p>
        </div>
        <Link
          href="/admin/printables/new"
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
        >
          New printable
        </Link>
      </div>

      <ul className="divide-y rounded-lg border">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div>
              <Link href={`/admin/printables/${r.id}`} className="font-medium hover:underline">
                {r.title}
              </Link>
              <div className="text-xs text-muted-foreground">
                {r.slug} · {r.pathwayId} · {r.isPublished ? "published" : "draft"}
                {r.isFree ? " · free" : ""}
                {r.isPremiumIncluded ? " · premium-included" : ""}
              </div>
            </div>
            <div className="flex gap-2 text-sm">
              <Link className="text-primary underline" href={`/admin/printables/${r.id}/analytics`}>
                Analytics
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
