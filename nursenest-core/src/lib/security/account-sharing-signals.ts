import { createHash, createHmac } from "node:crypto";

function pepper(): string {
  return (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "").trim();
}

/** HMAC-SHA256 hex (64 chars) for IP / UA / session material — never store raw values. */
export function hmacHex(input: string): string {
  const s = pepper();
  if (!s) return createHash("sha256").update(`no-auth-secret:${input}`).digest("hex");
  return createHmac("sha256", s).update(input).digest("hex");
}

export type AccountSharingEvaluation = {
  distinctIps24h: number;
  activeDeviceSlots7d: number;
  multiRegionShortWindow: boolean;
  reasons: string[];
};

export function evaluateAccountSharingSignals(args: {
  distinctIps24h: number;
  activeDeviceSlots7d: number;
  multiRegionShortWindow: boolean;
  maxIps: number;
  maxDevices: number;
}): AccountSharingEvaluation {
  const reasons: string[] = [];
  if (args.distinctIps24h > args.maxIps) {
    reasons.push("many_distinct_ips_24h");
  }
  if (args.activeDeviceSlots7d > args.maxDevices) {
    reasons.push("many_device_slots_7d");
  }
  if (args.multiRegionShortWindow) {
    reasons.push("multi_region_short_window");
  }
  return {
    distinctIps24h: args.distinctIps24h,
    activeDeviceSlots7d: args.activeDeviceSlots7d,
    multiRegionShortWindow: args.multiRegionShortWindow,
    reasons,
  };
}
