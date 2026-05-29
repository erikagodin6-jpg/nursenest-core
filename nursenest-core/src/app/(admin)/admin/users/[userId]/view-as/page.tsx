/**
 * Phase 11F — Admin "View As Learner" portal.
 *
 * Shows the target user's study context (health score, recent activity, subscription,
 * learning goals) as if you were looking at their screen — read-only, fully audited.
 *
 * Access: admin only. Every visit is logged.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { loadViewAsUserContext } from "@/lib/admin/admin-view-as-user";
import { computeLearnerHealthScore } from "@/lib/admin/learner-health-score";
import { buildAccountActivityEvidence } from "@/lib/admin/account-activity-evidence";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { AdminLearnerHealthPanel } from "@/components/admin/admin-learner-health-panel";
import { AdminActivityTimelinePanel } from "@/components/admin/admin-activity-timeline-panel";
import { AdminViewAsControls } from "@/components/admin/admin-view-as-controls";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ userId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  return { title: `View As Learner ${userId.slice(0, 8)}… · Admin`, robots: "noindex" };
}

function isLikelyCuid(id: string): boolean {
  return /^c[a-z0-9]{8,}$/i.test(id);
}

export default async function ViewAsLearnerPage({ params }: Props) {
  const admin = await requireAdmin();
  const { userId: targetId } = await params;

  if (!isLikelyCuid(targetId)) notFound();

  const user = isDatabaseUrlConfigured() ? await loadViewAsUserContext(targetId) : null;
  if (!user) notFound();

  // Audit every view
  safeServerLog("admin_impersonation", "view_as_page_loaded", {
    adminId: (admin as { id?: string } | undefined)?.id?.slice(0, 12) ?? "unknown",
    targetId: targetId.slice(0, 12),
    surface: "view_as_portal",
  });

  const [health, evidence, entitlement] = await Promise.all([
    computeLearnerHealthScore(targetId),
    buildAccountActivityEvidence(targetId),
    isDatabaseUrlConfigured()
      ? resolveEntitlement(targetId).catch(() => null)
      : Promise.resolve(null),
  ]);

  const sub = user.subscriptions[0];

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Impersonation warning banner */}
      <div className="mb-6 rounded-xl border-2 border-amber-400 bg-amber-50 px-5 py-4 dark:border-amber-500 dark:bg-amber-950/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
              🔍 Admin View-As Session — Read Only
            </p>
            <p className="mt-0.5 text-sm text-amber-800 dark:text-amber-300">
              You are viewing <strong>{user.name || user.email}</strong>&apos;s learner context as an admin.
              No actions taken here affect the learner account. This access is audited.
            </p>
          </div>
          <AdminViewAsControls targetUserId={targetId} />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin · Phase 11F</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--theme-heading-text)]">
            {user.name || "(no name)"}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href={`/admin/users/${targetId}`} className="text-primary underline">← Support detail</Link>
          <Link href="/admin/users" className="text-muted-foreground underline">User search</Link>
        </div>
      </div>

      {/* Identity grid */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="nn-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Account</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Tier</dt>
              <dd className="font-semibold uppercase">{user.tier ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Country</dt>
              <dd>{user.country ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Role</dt>
              <dd>{user.role}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="text-xs">{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="nn-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Subscription</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-semibold">{sub?.status ?? "None"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Plan tier</dt>
              <dd>{sub?.planTier ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Plan code</dt>
              <dd className="text-xs">{sub?.planCode ?? "—"}</dd>
            </div>
            {sub?.currentPeriodEnd && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Period end</dt>
                <dd className="text-xs">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</dd>
              </div>
            )}
            {sub?.cancelAtPeriodEnd && (
              <dd className="mt-1 text-xs font-semibold text-amber-700">Cancelling at period end</dd>
            )}
          </dl>
        </div>

        <div className="nn-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Study Context</p>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Pathway</dt>
              <dd className="text-xs">{user.targetExamPathwayId ?? user.learnerPath ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Allied key</dt>
              <dd>{user.alliedProfessionKey ?? "—"}</dd>
            </div>
            {user.examDate && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Exam date</dt>
                <dd className="text-xs">{new Date(user.examDate).toLocaleDateString()}</dd>
              </div>
            )}
            {entitlement && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Access</dt>
                <dd className="font-semibold text-xs">{entitlement.hasAccess ? "✅ Active" : "❌ No access"}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Health score */}
      {health && <AdminLearnerHealthPanel userId={targetId} initialScore={health} />}

      {/* Activity summary */}
      {evidence && (
        <section className="mt-6 nn-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Activity Summary</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Est. study hours", value: evidence.summary.totalEstimatedHours },
              { label: "Active days", value: evidence.summary.activeDays },
              { label: "Questions attempted", value: evidence.summary.questionAttempts.toLocaleString() },
              { label: "Flashcards answered", value: evidence.summary.flashcardsAnswered.toLocaleString() },
              { label: "Lessons viewed", value: evidence.summary.lessonsViewed.toLocaleString() },
              { label: "Practice tests", value: evidence.summary.practiceTestsStarted.toLocaleString() },
              { label: "CAT exams", value: (evidence.summary.examSessions).toLocaleString() },
              { label: "Last active", value: evidence.summary.lastActiveAt ? new Date(evidence.summary.lastActiveAt).toLocaleDateString() : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-border/60 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--theme-heading-text)]">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Full timeline */}
      {evidence && (
        <AdminActivityTimelinePanel userId={targetId} timeline={evidence.timeline} />
      )}
    </main>
  );
}
