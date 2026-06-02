/**
 * Server-only feature flag for the remediation engine.
 * When unset or not "true", all remediation persistence and APIs no-op safely.
 */
export function isRemediationEngineEnabled(): boolean {
  return String(process.env.NN_ENABLE_REMEDIATION_ENGINE ?? "").trim().toLowerCase() === "true";
}
