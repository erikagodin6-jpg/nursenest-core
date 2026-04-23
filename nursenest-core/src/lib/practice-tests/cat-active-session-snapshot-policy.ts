/**
 * CAT resilience policy (production contract):
 *
 * - **Never** use a stale published snapshot to repair or continue a corrupt / partially-loaded **active**
 *   adaptive session (no auto-complete, no jump to results, no silent empty CAT).
 * - Snapshots are allowed only for **static** inputs: pathway exam config, pool metadata, startup eligibility —
 *   not for mutating `CatAdaptiveState` or recovering an in-flight session after live loaders fail.
 *
 * Server routes that resume CAT must stay on the CAT surface with explicit recover / retry / start-fresh options.
 */
export const CAT_ACTIVE_SESSION_MUST_NOT_USE_STALE_SNAPSHOT = true as const;
