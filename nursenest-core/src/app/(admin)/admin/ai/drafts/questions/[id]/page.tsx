import Link from "next/link";
import { QuestionDraftStudioClient } from "@/components/admin/ai/question-draft-studio-client";
import { requireAdmin } from "@/lib/auth/guards";

type Props = { params: Promise<{ id: string }> };

export default async function AdminQuestionDraftPage(ctx: Props) {
  await requireAdmin();
  const { id } = await ctx.params;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <QuestionDraftStudioClient draftId={id} />
      <p className="mt-8 text-center text-xs text-muted">
        <Link href="/admin" className="underline">
          Admin home
        </Link>
      </p>
    </main>
  );
}
