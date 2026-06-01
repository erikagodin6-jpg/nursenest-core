import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { AdminViewAsSelector } from "@/components/admin/admin-view-as-selector";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getAdminViewAsLearnerContext } from "@/lib/admin/admin-view-as-learner-context";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";

export const dynamic = "force-dynamic";

export default async function AdminViewAsPage() {
  await requireAdmin();

  const session = await getProtectedRouteSession("admin.view-as");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const viewAsCtx = userId ? await getAdminViewAsLearnerContext(userId).catch(() => null) : null;
  const activeSimulation = viewAsCtx?.simulation;

  safeServerLog("admin", "view_as_page_opened", {
    adminIdPrefix: userId.slice(0, 8),
    hasActiveSimulation: activeSimulation ? "1" : "0",
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            ← Admin
          </Link>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">
          Admin Tools
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--semantic-text-primary)]">
          View As User
        </h1>
        <p className="max-w-xl text-sm leading-6 text-[var(--semantic-text-secondary)]">
          Experience NurseNest exactly as a specific user or simulated profile without modifying production data. Use this to verify paywalls, content access, and subscription state.
        </p>
      </header>

      {/* Active session warning */}
      {activeSimulation && (
        <div className="mb-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,var(--semantic-surface))] px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                Active view-as session
              </p>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
                {activeSimulation.targetEmail
                  ? `Real user: ${activeSimulation.targetEmail}`
                  : `Simulated: ${activeSimulation.track} · ${activeSimulation.lifecycle} · ${activeSimulation.country}`
                }
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href="/app"
                className="rounded-xl bg-[var(--semantic-brand)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
              >
                Resume session
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Security callout */}
      <div className="mb-6 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-tertiary)]">Security</p>
        <ul className="mt-1.5 space-y-1 text-xs text-[var(--semantic-text-secondary)]">
          <li>✓ Admin-only — requires DB-backed staff session</li>
          <li>✓ Cannot impersonate other admins or staff</li>
          <li>✗ Passwords, payment methods, and auth tokens are never exposed</li>
          <li>✓ Every session start/end is logged with admin ID, target user, and timestamp</li>
          <li>✓ Sessions expire automatically after 2 hours</li>
        </ul>
      </div>

      {/* Selector */}
      <section className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <AdminViewAsSelector />
      </section>

      {/* What gets verified */}
      <section className="mt-8 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6">
        <h2 className="mb-3 text-sm font-semibold text-[var(--semantic-text-primary)]">What you can verify</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[var(--semantic-text-secondary)] sm:grid-cols-3">
          {[
            "Homepage & onboarding",
            "Lessons (locked / unlocked)",
            "Flashcards",
            "Practice tests",
            "CAT adaptive exams",
            "Dashboard & report cards",
            "Study plans",
            "Blog (logged-in view)",
            "Subscription & billing pages",
            "Paywall enforcement",
            "Trial content gates",
            "Partial access (grace period)",
          ].map((item) => (
            <p key={item} className="flex items-center gap-1.5">
              <span className="text-[var(--semantic-brand)]">✓</span> {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
