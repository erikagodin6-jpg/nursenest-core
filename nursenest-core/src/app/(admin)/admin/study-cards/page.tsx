import { listPendingPublicVerifiedStudyDecks } from "@/lib/verified-study/verified-study-admin.server";
import { AdminVerifiedStudyQueueClient } from "@/components/admin/admin-verified-study-queue-client";

export const dynamic = "force-dynamic";

export default async function AdminVerifiedStudyCardsPage() {
  const decks = await listPendingPublicVerifiedStudyDecks(80);
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--semantic-text-primary)]">Verified study cards — moderation</h1>
        <p className="text-sm text-[var(--theme-body-text)]">
          Pending public community decks. Approve only after each card is verified and references pass the publication gate.
        </p>
      </header>
      <AdminVerifiedStudyQueueClient initialDecks={decks} />
    </div>
  );
}
