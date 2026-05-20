import { createHash } from "crypto";

function fingerprintSecret(): string {
  return (
    process.env.TRIAL_FINGERPRINT_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    "dev-only-trial-fingerprint-unsafe"
  );
}

export function hashTrialDeviceFingerprint(deviceId: string): string {
  return createHash("sha256").update(`${deviceId}|${fingerprintSecret()}`, "utf8").digest("hex");
}
