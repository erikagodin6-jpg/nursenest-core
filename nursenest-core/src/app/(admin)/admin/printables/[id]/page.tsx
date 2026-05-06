import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { isPrintableAdminApiAllowed } from "@/lib/printables/printable-store-flags";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPrintableDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  if (!isPrintableAdminApiAllowed()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 text-sm text-muted-foreground">
        <p>Printable admin is disabled.</p>
      </main>
    );
  }

  const { id } = await params;
  const row = await prisma.printableProduct.findUnique({
    where: { id },
    include: {
      fileAsset: { select: { id: true, filename: true, mimeType: true, kind: true } },
      thumbnailAsset: { select: { id: true, filename: true, mimeType: true, kind: true } },
    },
  });
  if (!row) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-muted-foreground">
        <Link href="/admin/printables" className="underline">
          Printables
        </Link>
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{row.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Slug: {row.slug} · v{row.version} · {row.isPublished ? "published" : "draft"}
      </p>
      <dl className="mt-6 space-y-2 text-sm">
        <div>
          <dt className="font-medium">PDF asset</dt>
          <dd className="text-muted-foreground">
            {row.fileAsset.filename} ({row.fileAsset.kind})
          </dd>
        </div>
        {row.thumbnailAsset ? (
          <div>
            <dt className="font-medium">Thumbnail</dt>
            <dd className="text-muted-foreground">
              {row.thumbnailAsset.filename} ({row.thumbnailAsset.kind})
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link className="rounded-md border px-3 py-2 underline" href={`/admin/printables/${id}/analytics`}>
          Analytics
        </Link>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Admin preview stream: <code className="rounded bg-muted px-1">POST /api/admin/printables/{id}/preview-download</code>{" "}
        (staff session). Counts as <code className="rounded bg-muted px-1">ADMIN_PREVIEW</code> in analytics.
      </p>
    </main>
  );
}
