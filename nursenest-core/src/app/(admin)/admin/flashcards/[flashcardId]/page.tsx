import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminFlashcardEditorClient } from "@/components/admin/flashcards/admin-flashcard-editor-client";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ flashcardId: string }> };

export default async function AdminFlashcardEditorPage({ params }: Props) {
  await requireAdmin();
  const { flashcardId } = await params;
  const isNew = flashcardId === "new";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/flashcards"
        className="text-sm text-[var(--semantic-brand)] underline underline-offset-2"
      >
        ← Flashcards
      </Link>
      <h1 className="mt-3 text-xl font-bold text-[var(--semantic-text-primary)]">
        {isNew ? "Create flashcard" : "Edit flashcard"}
      </h1>
      <div className="mt-6">
        <AdminFlashcardEditorClient flashcardId={isNew ? null : flashcardId} />
      </div>
    </main>
  );
}
