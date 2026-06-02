import "server-only";

function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return defaultValue;
  return v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes";
}

function envInt(name: string, defaultValue: number): number {
  const v = process.env[name];
  if (v === undefined || v === "") return defaultValue;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : defaultValue;
}

/** Soft account-sharing / multi-device monitoring (off by default). */
export function isAccountSharingMonitorEnabled(): boolean {
  return envBool("NN_ENABLE_ACCOUNT_SHARING_MONITOR", false);
}

/** When true, never auto-queue admin abuse rows (logs only). Default true. */
export function isAccountSharingSoftLimitOnly(): boolean {
  return envBool("NN_ACCOUNT_SHARING_SOFT_LIMIT_ONLY", true);
}

/** When true, hard block subscriber APIs with session_review_required (off by default). */
export function isAccountSharingEnforceEnabled(): boolean {
  return envBool("NN_ACCOUNT_SHARING_ENFORCE", false);
}

export function accountSharingMaxActiveDevices(): number {
  return envInt("NN_ACCOUNT_SHARING_MAX_ACTIVE_DEVICES", 4);
}

export function accountSharingMaxIps24h(): number {
  return envInt("NN_ACCOUNT_SHARING_MAX_IPS_24H", 5);
}
