import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminBlogGeminiDraftClient } from "@/components/admin/admin-blog-gemini-draft-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogGeminiDraftPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Blog</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Gemini Draft Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cheap Phase 1 path: one draft at a time, admin-only, no publish automation.
          </p>
        </div>
        <Link href="/admin/blog/generate" className="text-sm font-semibold text-primary underline">
          Open existing OpenAI generator
        </Link>
      </div>

      <div className="mt-8">
        <AdminBlogGeminiDraftClient />
      </div>
    </main>
  );
}
