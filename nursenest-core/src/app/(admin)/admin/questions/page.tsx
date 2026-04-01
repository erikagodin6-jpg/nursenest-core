import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminQuestionsPage() {
  await requireAdmin();
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--theme-heading-text)]">Question bank admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use JSON diagnostics for bulk review; AI drafting lives under{" "}
        <Link className="font-semibold text-primary underline" href="/admin/ai/exam-questions">
          AI exam questions
        </Link>
        .
      </p>
      <ul className="mt-6 space-y-2 text-sm">
        <li>
          <Link className="text-primary underline" href="/api/admin/questions?page=1&pageSize=20">
            GET /api/admin/questions
          </Link>
        </li>
        <li>
          <Link className="text-primary underline" href="/api/admin/question-bank-coverage">
            Question bank coverage
          </Link>
        </li>
        <li>
          <Link className="text-primary underline" href="/api/admin/question-bank-diagnostics">
            Question bank diagnostics
          </Link>
        </li>
      </ul>
    </main>
  );
}
