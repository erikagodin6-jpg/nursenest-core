import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminBlogControlPanelClient } from "@/components/admin/admin-blog-control-panel-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogControlPanelPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; preview?: string }>;
}) {
  await requireAdmin();
  const sp = (await searchParams) ?? {};
  const initialPostId = typeof sp.id === "string" && sp.id.length > 0 ? sp.id : null;
  const initialPreviewOpen = sp.preview === "1" || sp.preview === "true";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">AI generation control panel</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Structured editorial plan plus full HTML draft, saved as a real <code className="rounded bg-muted px-1">DRAFT</code> post.
            Regenerate sections, edit in place, save, then publish when ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/blog" className="text-primary underline">
            ← Blog hub
          </Link>
          <Link href="/admin/blog/generate" className="text-muted-foreground underline">
            Legacy generator
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <AdminBlogControlPanelClient initialPostId={initialPostId} initialPreviewOpen={initialPreviewOpen} />
      </div>
    </main>
  );
}
