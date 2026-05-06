/**
 * OSCE prep + clinical scenarios rollout gate (client + server).
 * Default: off — routes are not published; production direct hits return `notFound()`.
 */
export function isOsceScenariosPubliclyEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_OSCE_SCENARIOS === "true";
}
