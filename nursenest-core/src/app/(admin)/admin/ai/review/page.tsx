import Link from "next/link";
import { ReviewQueueGateway } from "@/components/admin/ai/review-queue-gateway";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminAiReviewPage() {
  await requireAdmin();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <Link href="/admin" className="text-sm text-primary underline">
        ← Admin
      </Link>
      <h1 className="mt-4 text-2xl font-bold">AI draft review queue</h1>
      <p className="mt-2 text-sm text-muted">
        Approve or reject drafts. Promotion creates a <strong>DRAFT</strong> row in Question / Flashcard tables (not published to learners).
      </p>
      <div className="mt-8">
        <ReviewQueueGateway />
      </div>
    </main>
  );
}
