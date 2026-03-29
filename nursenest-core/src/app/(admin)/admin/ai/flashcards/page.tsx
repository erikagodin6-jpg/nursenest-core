import Link from "next/link";
import { FlashcardsGateway } from "@/components/admin/ai/flashcards-gateway";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminFlashcardsAiPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Link href="/admin" className="text-sm text-primary underline">
        ← Admin
      </Link>
      <h1 className="mt-4 text-2xl font-bold">AI flashcard drafts</h1>
      <p className="mt-2 text-sm text-muted">
        Drafts are stored as <strong>GeneratedFlashcardDraft</strong>. Promote only after review.
      </p>
      <div className="mt-8">
        <FlashcardsGateway />
      </div>
    </main>
  );
}
