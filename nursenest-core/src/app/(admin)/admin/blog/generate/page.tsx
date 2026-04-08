import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { totalRnTopicMapRowsEstimate } from "@/lib/admin/blog-topic-map-batch";
import { AdminBlogGenerateClient } from "@/components/admin/admin-blog-generate-client";
import { AdminBlogBatchClient } from "@/components/admin/admin-blog-batch-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogGeneratePage() {
  await requireAdmin();
  const topicRows = totalRnTopicMapRowsEstimate();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI drafts (single request) + RN topic-map shells (chunked, timeout-safe). ~{topicRows} topic rows available for bulk
            shells.
          </p>
        </div>
        <Link href="/admin/blog" className="text-sm font-semibold text-primary underline">
          ← Blog hub
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        <div className="rounded-xl border border-border/70 bg-muted/20 p-4 text-sm">
          For the full structured workflow (titles, outline, FAQs, internal links, APA, section regen), use the{" "}
          <Link href="/admin/blog/control-panel" className="font-semibold text-primary underline">
            AI control panel
          </Link>
          . Need quantity + cadence? Use{" "}
          <Link href="/admin/blog/campaigns" className="font-semibold text-primary underline">
            SEO campaigns
          </Link>
          .
        </div>
        <AdminBlogGenerateClient />
        <AdminBlogBatchClient />
      </div>
    </main>
  );
}
