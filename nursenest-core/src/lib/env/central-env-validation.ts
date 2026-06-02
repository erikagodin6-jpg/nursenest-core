/**
 * Cross-cutting env checks (startup): public surface must never carry secret-shaped values.
 * Pair with {@link runProductionEnvGuard} for production-required vars.
 */
import { redactOpaqueSecret } from "@/lib/env/redact-secrets";

function isTruthy(v: string | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** True if value looks like material that must never be prefixed with NEXT_PUBLIC_. */
export function looksLikeSecretMaterial(value: string): boolean {
  const t = value.trim();
  if (t.length < 8) return false;
  if (/^sk_(live|test)_[a-zA-Z0-9]{16,}/.test(t)) return true;
  if (/^whsec_[a-zA-Z0-9]{16,}/.test(t)) return true;
  if (/^AKIA[0-9A-Z]{16}$/.test(t)) return true;
  if (/BEGIN [A-Z ]*PRIVATE KEY/.test(t)) return true;
  if (/postgresql:\/\/[^:]+:[^@\s]+@/i.test(t) || /mysql:\/\/[^:]+:[^@\s]+@/i.test(t)) return true;
  return false;
}

/**
 * Warn once per process if any NEXT_PUBLIC_* value looks like a secret.
 * Does not throw — misconfiguration should be fixed before deploy.
 */
export function assertNextPublicSurfaceHasNoSecrets(): void {
  let warned = false;
  for (const [key, val] of Object.entries(process.env)) {
    if (!key.startsWith("NEXT_PUBLIC_")) continue;
    if (!isTruthy(val)) continue;
    if (!looksLikeSecretMaterial(val!)) continue;
    warned = true;
    console.error(
      `[nursenest-core] env FATAL_SURFACE: ${key} appears to contain secret-shaped data — never use NEXT_PUBLIC_ for keys or connection strings (value=${redactOpaqueSecret(val!, 4)})`,
    );
  }
  if (warned && process.env.NN_STRICT_PUBLIC_ENV === "1") {
    console.error("[nursenest-core] env: exiting — unset NN_STRICT_PUBLIC_ENV or fix NEXT_PUBLIC_* misuse.");
    process.exit(1);
  }
}

/**
 * Non-production: warn if Stripe live secret is loaded (common foot-gun during local testing).
 */
export function warnIfStripeLiveKeyOutsideProduction(): void {
  if (process.env.NODE_ENV === "production") return;
  const k = process.env.STRIPE_SECRET_KEY?.trim();
  if (k?.startsWith("sk_live_")) {
    console.warn(
      "[nursenest-core] env: STRIPE_SECRET_KEY is sk_live_ while NODE_ENV is not production — use sk_test_ locally; rotate if this log appeared in shared logs.",
    );
  }
}
