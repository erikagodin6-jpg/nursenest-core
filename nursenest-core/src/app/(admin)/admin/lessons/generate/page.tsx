import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminAiLessonGeneratorClient } from "@/components/admin/lessons/admin-ai-lesson-generator-client";

export const dynamic = "force-dynamic";

export default async function AdminAiLessonGeneratePage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/admin/lessons" className="text-primary underline">
          ← Lesson library
        </Link>
        <Link href="/admin/lessons/generate-batch" className="text-primary underline">
          Batch generate
        </Link>
        <Link href="/admin" className="text-muted-foreground underline">
          Admin home
        </Link>
      </div>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading generator…</p>}>
        <AdminAiLessonGeneratorClient />
      </Suspense>
    </main>
  );
}
