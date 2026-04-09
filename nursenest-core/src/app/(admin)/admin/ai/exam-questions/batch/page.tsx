import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { ExamQuestionsBatchClient } from "@/components/admin/ai/exam-questions-batch-client";

export const dynamic = "force-dynamic";

export default async function AdminExamQuestionsBatchPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-6 flex flex-wrap gap-3 text-sm">
        <Link href="/admin/ai/exam-questions" className="text-primary underline">
          ← Question studio
        </Link>
        <Link href="/admin" className="text-muted underline">
          Admin
        </Link>
      </div>
      <h1 className="text-2xl font-bold">Batch question drafts</h1>
      <p className="mt-2 text-sm text-muted">
        Requires <code className="rounded bg-black/5 px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and OpenAI credentials.
      </p>
      <div className="mt-8">
        <ExamQuestionsBatchClient />
      </div>
    </main>
  );
}
