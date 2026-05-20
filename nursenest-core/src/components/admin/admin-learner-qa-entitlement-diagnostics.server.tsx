import { loadCanonicalLearnerDiagnosticsForUserId } from "@/lib/entitlements/canonical-learner-access.server";

/** Staff-only learner QA: surfaces non-sensitive canonical entitlement diagnostics for the signed-in admin user. */
export async function AdminLearnerQaEntitlementDiagnostics({ userId }: { userId: string }) {
  const diag = await loadCanonicalLearnerDiagnosticsForUserId(userId);
  if (!diag) {
    return (
      <p className="mb-4 rounded-lg border border-[var(--semantic-border-soft)] bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Entitlement diagnostics unavailable (database not configured).
      </p>
    );
  }

  return (
    <aside
      className="mb-4 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-positive)] p-3 text-xs text-[var(--semantic-text-primary)] shadow-sm"
      role="status"
      data-testid="admin-learner-qa-entitlement-diagnostics"
    >
      <p className="font-semibold text-[var(--semantic-text-primary)]">Your session — canonical entitlement (Phase 4B)</p>
      <dl className="mt-2 grid gap-1 sm:grid-cols-2">
        <div>
          <dt className="text-[var(--semantic-text-muted)]">Grant / deny</dt>
          <dd className="font-mono">{diag.grantOrDeny}</dd>
        </div>
        <div>
          <dt className="text-[var(--semantic-text-muted)]">Reason code</dt>
          <dd className="font-mono">{diag.reasonCode}</dd>
        </div>
        <div>
          <dt className="text-[var(--semantic-text-muted)]">Tier</dt>
          <dd className="font-mono">{diag.tier ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-[var(--semantic-text-muted)]">Pathway id</dt>
          <dd className="font-mono break-all">{diag.pathwayId ?? "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--semantic-text-muted)]">Resolution helper</dt>
          <dd className="break-all font-mono text-[11px] leading-snug">{diag.resolutionHelper}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--semantic-text-muted)]">Tier / pathway mismatch warning</dt>
          <dd>
            {diag.tierPathwayMismatchWarning ? (
              <span className="text-[var(--semantic-warning)] font-semibold">yes</span>
            ) : (
              <span className="text-[var(--semantic-success)]">no</span>
            )}
            {diag.mismatchCodes.length > 0 ? (
              <span className="ml-2 font-mono text-[11px]">({diag.mismatchCodes.join(", ")})</span>
            ) : null}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
