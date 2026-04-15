/**
 * Client bundle flags — only `NEXT_PUBLIC_*` is available in the browser without a server pass-through.
 */

export function isClientDurabilityNonCriticalDisabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_NN_DEGRADED_MODE === "1" || process.env.NEXT_PUBLIC_NN_CORE_ONLY_EMERGENCY === "1"
  );
}
