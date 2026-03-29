import Link from "next/link";
import { ExamQuestionsGateway } from "@/components/admin/ai/exam-questions-gateway";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminExamQuestionsPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/admin" className="text-sm text-primary underline">
        ← Admin
      </Link>
      <h1 className="mt-4 text-2xl font-bold">AI exam question drafts</h1>
      <p className="mt-2 text-sm text-muted">
        Requires <code className="rounded bg-black/5 px-1">AI_ADMIN_GENERATION_ENABLED=true</code> and OpenAI-compatible credentials.
        Outputs are stored as <strong>GeneratedQuestionDraft</strong> — review before promotion.
      </p>
      <div className="mt-8">
        <ExamQuestionsGateway />
      </div>
    </main>
  );
}
