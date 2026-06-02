import type { EntitlementDriftSignals } from "@/lib/billing/entitlement-drift-signals.server";

/**
 * Non-sensitive billing admin copy: documents canonical server resolution and aggregate mismatch signals.
 * No Stripe customer ids (those stay in the subscription table section with truncation only).
 */
export function AdminPhase4bCanonicalEntitlementsPanel({
  drift,
}: {
  drift: EntitlementDriftSignals | null;
}) {
  const tierMismatchCount = drift?.signals.activeLikeTierMismatchUser ?? 0;
  const tierPathwayMismatchWarning = tierMismatchCount > 0;

  return (
    <aside
      className="mt-6 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-4 text-sm text-[var(--semantic-text-primary)]"
      role="region"
      aria-label="Canonical entitlement resolution"
      data-testid="admin-phase4b-canonical-entitlements"
    >
      <p className="font-semibold text-[var(--semantic-text-primary)]">Phase 4B — canonical learner entitlements</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-xs sm:text-sm text-[var(--semantic-text-secondary)]">
        <li>
          <strong className="text-[var(--semantic-text-primary)]">Helper path:</strong>{" "}
          <code className="rounded bg-muted px-1 text-[11px]">getUserAccess</code> →{" "}
          <code className="rounded bg-muted px-1 text-[11px]">accessScopeFromUserAccess</code> →{" "}
          <code className="rounded bg-muted px-1 text-[11px]">toCanonicalLearnerAccess</code> (see{" "}
          <code className="rounded bg-muted px-1 text-[11px]">canonical-learner-access.server.ts</code>)
        </li>
        <li>
          <strong className="text-[var(--semantic-text-primary)]">Premium APIs:</strong>{" "}
          <code className="rounded bg-muted px-1 text-[11px]">requireSubscriberSession</code> (same DB chain).
        </li>
        <li>
          <strong className="text-[var(--semantic-text-primary)]">Website checkout → /app:</strong> same NextAuth session
          and Postgres mirror — no parallel auth system.
        </li>
      </ul>
      <p className="mt-3 text-xs font-semibold text-[var(--semantic-text-primary)]">Aggregate tier / pathway signals</p>
      <ul className="mt-1 list-inside list-disc text-xs text-[var(--semantic-text-secondary)]">
        <li>
          Tier mismatch rows (paid-like subscription <code className="rounded bg-muted px-1">planTier</code> ≠{" "}
          <code className="rounded bg-muted px-1">User.tier</code>):{" "}
          <span className="tabular-nums font-semibold">{tierMismatchCount}</span>
        </li>
        <li>
          <strong className="text-[var(--semantic-text-primary)]">Warning flag:</strong>{" "}
          {tierPathwayMismatchWarning ? (
            <span className="text-[var(--semantic-warning)]">yes — review drift panel above</span>
          ) : (
            <span className="text-[var(--semantic-success)]">no</span>
          )}
        </li>
        {tierPathwayMismatchWarning ? (
          <li className="list-none pl-4 text-[11px] text-[var(--semantic-text-muted)]">
            Codes: <code className="rounded bg-muted px-1">aggregate_activeLikeTierMismatchUser</code>
          </li>
        ) : null}
      </ul>
    </aside>
  );
}
