import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { getPrintableProductAnalytics } from "@/lib/printables/printable-analytics.server";
import { isPrintableAdminApiAllowed } from "@/lib/printables/printable-store-flags";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPrintableAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  if (!isPrintableAdminApiAllowed()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-sm text-muted-foreground">
        <p>Printable admin is disabled.</p>
      </main>
    );
  }

  const { id } = await params;
  const product = await prisma.printableProduct.findUnique({ where: { id }, select: { id: true, title: true, slug: true } });
  if (!product) notFound();

  const analytics = await getPrintableProductAnalytics(id);

  const recent = await prisma.printableDownloadEvent.findMany({
    where: { printableProductId: id },
    orderBy: { downloadedAt: "desc" },
    take: 50,
    select: {
      id: true,
      downloadedAt: true,
      source: true,
      pathwayId: true,
      userId: true,
      userAgentHash: true,
      ipHash: true,
    },
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-muted-foreground">
        <Link href={`/admin/printables/${id}`} className="underline">
          {product.title}
        </Link>{" "}
        · Analytics (staff-only)
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Downloads</h1>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <dt className="text-muted-foreground">Total downloads</dt>
          <dd className="text-2xl font-semibold">{analytics.totalDownloads}</dd>
        </div>
        <div className="rounded-lg border p-4">
          <dt className="text-muted-foreground">Unique users</dt>
          <dd className="text-2xl font-semibold">{analytics.uniqueUsersDownloaded}</dd>
        </div>
        <div className="rounded-lg border p-4 sm:col-span-2">
          <dt className="text-muted-foreground">By source</dt>
          <dd className="mt-1 font-mono text-xs">{JSON.stringify(analytics.downloadsBySource)}</dd>
        </div>
        <div className="rounded-lg border p-4 sm:col-span-2">
          <dt className="text-muted-foreground">Last download</dt>
          <dd>{analytics.lastDownloadedAt ?? "—"}</dd>
        </div>
      </dl>

      <h2 className="mt-10 text-lg font-semibold">Recent events</h2>
      <p className="text-xs text-muted-foreground">IP and user-agent are stored as HMAC hashes only.</p>
      <table className="mt-3 w-full text-left text-xs">
        <thead>
          <tr className="border-b">
            <th className="py-2">When</th>
            <th className="py-2">Source</th>
            <th className="py-2">Pathway</th>
            <th className="py-2">User</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((e) => (
            <tr key={e.id} className="border-b border-muted">
              <td className="py-2">{e.downloadedAt.toISOString()}</td>
              <td className="py-2">{e.source}</td>
              <td className="py-2">{e.pathwayId ?? "—"}</td>
              <td className="py-2 font-mono">{e.userId?.slice(0, 8) ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
