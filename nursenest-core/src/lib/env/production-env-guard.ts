/**
 * Centralized production environment validation (Node instrumentation).
 * Use {@link NN_STRICT_PRODUCTION_ENV}=1 to exit the process on critical gaps (CI / strict deploys).
 *
 * Naming: prefer `AUTH_SECRET` over legacy `NEXTAUTH_SECRET`; `DATABASE_URL` is canonical
 * (`PROD_DATABASE_URL` is a legacy alias merged in `env-bootstrap` only when `DATABASE_URL` is unset).
 */
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type EnvIssue = {
  code: string;
  severity: "critical" | "warning";
  message: string;
};

function isTruthy(v: string | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** Aligned with `enforceCronSecretOrResponse` — production-like schedulers expect `CRON_SECRET`. */
function isProductionLikeRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NURSE_NEST_ENFORCE_CRON_SECRET === "1"
  );
}

export function collectProductionEnvIssues(): EnvIssue[] {
  if (process.env.NODE_ENV !== "production") return [];

  const issues: EnvIssue[] = [];

  if (!isTruthy(process.env.AUTH_SECRET) && !isTruthy(process.env.NEXTAUTH_SECRET)) {
    issues.push({
      code: "auth_secret_missing",
      severity: "critical",
      message: "AUTH_SECRET or NEXTAUTH_SECRET must be set — sessions and signing will fail.",
    });
  } else {
    const raw = process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim() || "";
    if (raw.length > 0 && raw.length < 32) {
      issues.push({
        code: "auth_secret_short",
        severity: "warning",
        message:
          "AUTH_SECRET/NEXTAUTH_SECRET should be at least 32 characters (use `openssl rand -base64 32` or similar). Short secrets weaken JWT signing.",
      });
    }
  }

  if (!isDatabaseUrlConfigured()) {
    issues.push({
      code: "database_url_missing",
      severity: "critical",
      message: "DATABASE_URL (or legacy PROD_DATABASE_URL when DATABASE_URL is unset) must be set for Prisma.",
    });
  }

  if (!isTruthy(process.env.NEXT_PUBLIC_APP_URL)) {
    issues.push({
      code: "public_app_url_missing",
      severity: "critical",
      message:
        "NEXT_PUBLIC_APP_URL must be set to the public https origin — Stripe billing and portal URLs require it in production.",
    });
  }

  if (!isTruthy(process.env.STRIPE_WEBHOOK_SECRET)) {
    issues.push({
      code: "stripe_webhook_secret_missing",
      severity: "critical",
      message: "STRIPE_WEBHOOK_SECRET must be set — webhook signature verification will reject events.",
    });
  }

  if (!isTruthy(process.env.STRIPE_SECRET_KEY)) {
    issues.push({
      code: "stripe_secret_key_missing",
      severity: "warning",
      message: "STRIPE_SECRET_KEY is unset — checkout and billing API will return unavailable.",
    });
  }

  const authUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!isTruthy(authUrl)) {
    issues.push({
      code: "auth_url_missing",
      severity: "warning",
      message: "AUTH_URL (or NEXTAUTH_URL) is unset — cookies/redirects may rely on inferred host; set to public origin.",
    });
  } else {
    try {
      const { pathname } = new URL(authUrl.trim());
      if (pathname !== "/" && pathname !== "") {
        issues.push({
          code: "auth_url_has_path",
          severity: "warning",
          message: `AUTH_URL/NEXTAUTH_URL should be origin-only (no path). Got pathname "${pathname.slice(0, 96)}".`,
        });
      }
    } catch {
      issues.push({
        code: "auth_url_invalid",
        severity: "warning",
        message: "AUTH_URL/NEXTAUTH_URL is not a valid URL.",
      });
    }
  }

  if (isProductionLikeRuntime() && !isTruthy(process.env.CRON_SECRET)) {
    issues.push({
      code: "cron_secret_missing",
      severity: "warning",
      message:
        "CRON_SECRET is unset — POST /api/cron/* will return 503 (misconfigured) or be open in non-prod-like envs. Set a strong secret and send Authorization: Bearer.",
    });
  }

  return issues;
}

function strictModeEnabled(): boolean {
  const v = process.env.NN_STRICT_PRODUCTION_ENV?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/**
 * Logs issues to stderr; optionally exits with code 1 when strict mode is on and any **critical** issue exists.
 */
export function runProductionEnvGuard(): void {
  const issues = collectProductionEnvIssues();
  if (issues.length === 0) return;

  for (const i of issues) {
    const level = i.severity === "critical" ? "critical" : "warning";
    console.error(`[nursenest-core] env_guard ${level} code=${i.code} — ${i.message}`);
  }

  const critical = issues.filter((i) => i.severity === "critical");
  if (strictModeEnabled() && critical.length > 0) {
    console.error(
      `[nursenest-core] env_guard: exiting due to ${critical.length} critical issue(s). Set env vars or disable strict mode with NN_STRICT_PRODUCTION_ENV=0 (not recommended for production).`,
    );
    process.exit(1);
  }
}
