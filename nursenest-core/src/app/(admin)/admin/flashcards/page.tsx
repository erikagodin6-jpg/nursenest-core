import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminFlashcardListClient } from "@/components/admin/flashcards/admin-flashcard-list-client";

export const dynamic = "force-dynamic";

export default async function AdminFlashcardsPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-[var(--semantic-brand)] underline underline-offset-2">
            ← Admin
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-[var(--semantic-text-primary)]">Flashcards</h1>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            Canonical flashcard editor — MCQ and SATA with relational option persistence.
          </p>
        </div>
        <Link
          href="/admin/flashcards/new"
          className="rounded-full bg-[var(--semantic-brand)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          + New flashcard
        </Link>
      </div>
      <AdminFlashcardListClient />
    </main>
  );
}
