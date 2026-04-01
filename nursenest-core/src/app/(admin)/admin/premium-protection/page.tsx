import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { loadPremiumProtectionAdminSnapshot } from "@/lib/admin/load-premium-protection-admin-snapshot";
import { ProtectionAbuseReviewPanel } from "@/components/admin/protection-abuse-review-panel";

export const dynamic = "force-dynamic";

function FlagPill({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        on ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100" : "bg-muted text-muted-foreground"
      }`}
    >
      {label}: {on ? "on" : "off"}
    </span>
  );
}

export default async function AdminPremiumProtectionPage() {
  await requireAdmin();
  const snap = await loadPremiumProtectionAdminSnapshot();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/admin" className="text-primary underline hover:opacity-90">
          ← Admin overview
        </Link>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
          <h1 className="mt-1 text-3xl font-bold text-[var(--theme-heading-text)]">Premium protection</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Aggregated deterrence and API signals (UTC day). Browser limits are not DRM—enforcement stays on the server.
            Note bodies are never listed here.
          </p>
        </div>
        {snap ? (
          <p className="text-xs text-muted-foreground">Updated {new Date(snap.generatedAt).toLocaleString()}</p>
        ) : null}
      </div>

      {!snap ? (
        <p className="mt-8 text-sm text-muted-foreground">Snapshot unavailable (database or safe mode).</p>
      ) : (
        <div className="mt-8 space-y-8">
          <section className="nn-card p-6">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Environment flags</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Tune with these variables (boolean: 1/true/yes). Names only—values are not displayed.
            </p>
            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
              {snap.envVarNames.map((name) => (
                <li key={name}>
                  <code className="text-foreground">{name}</code>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <FlagPill label="Copy deterrence" on={snap.flags.copyDeterrence} />
              <FlagPill label="Watermark" on={snap.flags.watermark} />
              <FlagPill label="Hide protected on print" on={snap.flags.hideProtectedOnPrint} />
              <FlagPill label="Blur on tab hidden" on={snap.flags.blurOnHiddenTab} />
            </div>
          </section>

          <section className="nn-card p-6">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Learner notes (metadata)</h2>
            <p className="mt-1 text-xs text-muted-foreground">Adoption counts only—no titles or bodies at bulk scale.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total notes</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{snap.notesTotal.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Updated (24h)</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                  {snap.notesUpdatedLast24h.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          <section className="nn-card p-6">
            <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Today&apos;s rollups ({snap.utcDay} UTC)</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Keys combine client deterrence (<code className="text-foreground">client_*</code>) and API abuse (
              <code className="text-foreground">api_abuse_*</code>). Segment is surface or route.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Metric</th>
                    <th className="py-2 pr-4 font-medium">Segment</th>
                    <th className="py-2 font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {snap.todayRollups.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-muted-foreground">
                        No rollup rows for this UTC day yet.
                      </td>
                    </tr>
                  ) : (
                    snap.todayRollups.map((r) => (
                      <tr key={`${r.metricKey}-${r.segment}`} className="border-b border-border/40">
                        <td className="py-2 pr-4 font-mono text-xs text-foreground">{r.metricKey}</td>
                        <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{r.segment || "—"}</td>
                        <td className="py-2 tabular-nums text-foreground">{r.count.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="nn-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Needs review</h2>
              <Link href="/admin/users" className="text-sm font-semibold text-primary underline">
                Users directory
              </Link>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Heuristic queue from repeated rate limits or bulk fetches. Dismiss clears a false alarm; resolve marks review
              complete (e.g. handled offline). Optional internal note only.
            </p>
            <div className="mt-4">
              <ProtectionAbuseReviewPanel
                initialOpen={snap.openAbuseReviews}
                initialClosed={snap.recentClosedAbuseReviews}
                summary={snap.abuseReviewSummary}
              />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
