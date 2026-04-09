import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminBlogStudioClient } from "@/components/admin/admin-blog-studio-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogStudioPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog · AI</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Article studio</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Structured editorial package: SEO fields, outline, HTML draft, internal links, images, APA lines, and schema notes—saved
            as a database draft you refine in the full editor, then validate and publish.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/blog" className="text-primary underline">
            ← Blog hub
          </Link>
          <Link href="/admin/blog/control-panel" className="text-muted-foreground underline">
            Full control panel
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <AdminBlogStudioClient />
      </div>
    </main>
  );
}
