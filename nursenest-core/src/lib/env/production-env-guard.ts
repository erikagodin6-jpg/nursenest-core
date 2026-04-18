/**
 * Centralized production environment validation (Node instrumentation).
 *
 * **Default:** In `NODE_ENV=production`, env issues are logged but do not exit the process.
 * Set `NN_STRICT_PRODUCTION_ENV=1` to fail fast on critical issues when you explicitly want strict startup gating.
 *
 * Naming: prefer `AUTH_SECRET` over legacy `NEXTAUTH_SECRET`; `DATABASE_URL` is the only database URL variable.
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

function collectDatabaseUrlIssues(): EnvIssue[] {
  const issues: EnvIssue[] = [];
  if (!isDatabaseUrlConfigured()) {
    issues.push({
      code: "database_url_missing",
      severity: "critical",
      message: "DATABASE_URL must be set to a valid Postgres connection string.",
    });
    return issues;
  }
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return issues;
  try {
    const u = new URL(raw);
    const scheme = u.protocol.replace(":", "").toLowerCase();
    if (scheme !== "postgresql" && scheme !== "postgres") {
      issues.push({
        code: "database_url_invalid_scheme",
        severity: "critical",
        message: `DATABASE_URL must use postgres or postgresql scheme (got "${scheme}").`,
      });
    }
  } catch {
    issues.push({
      code: "database_url_unparseable",
      severity: "critical",
      message: "DATABASE_URL is not a valid URL — check escaping, encoding, and format.",
    });
  }
  return issues;
}

function collectAuthUrlIssues(): EnvIssue[] {
  const issues: EnvIssue[] = [];
  const authUrl = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (!isTruthy(authUrl)) {
    issues.push({
      code: "auth_url_missing",
      severity: "critical",
      message:
        "AUTH_URL or NEXTAUTH_URL must be set to the public app origin (e.g. https://www.example.com) — no path.",
    });
    return issues;
  }
  try {
    const u = new URL(authUrl!);
    const pathname = u.pathname;
    if (pathname !== "/" && pathname !== "") {
      issues.push({
        code: "auth_url_has_path",
        severity: "critical",
        message: `AUTH_URL/NEXTAUTH_URL must be origin-only (no /api/auth path). Got pathname "${pathname.slice(0, 96)}".`,
      });
    }
    if (process.env.NODE_ENV === "production" && u.protocol !== "https:") {
      issues.push({
        code: "auth_url_not_https",
        severity: "critical",
        message: "AUTH_URL/NEXTAUTH_URL must use https:// in production.",
      });
    }
  } catch {
    issues.push({
      code: "auth_url_invalid",
      severity: "critical",
      message: "AUTH_URL/NEXTAUTH_URL is not a valid URL.",
    });
  }
  return issues;
}

export function collectProductionEnvIssues(): EnvIssue[] {
  if (process.env.NODE_ENV !== "production") return [];

  const issues: EnvIssue[] = [];

  issues.push(...collectDatabaseUrlIssues());

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

  issues.push(...collectAuthUrlIssues());

  if (!isTruthy(process.env.NEXT_PUBLIC_APP_URL)) {
    issues.push({
      code: "public_app_url_missing",
      severity: "critical",
      message:
        "NEXT_PUBLIC_APP_URL must be set to the public https origin — Stripe billing and portal URLs require it in production.",
    });
  } else {
    try {
      const u = new URL(process.env.NEXT_PUBLIC_APP_URL!.trim());
      if (process.env.NODE_ENV === "production" && u.protocol !== "https:") {
        issues.push({
          code: "public_app_url_not_https",
          severity: "warning",
          message: "NEXT_PUBLIC_APP_URL should use https:// in production.",
        });
      }
    } catch {
      issues.push({
        code: "public_app_url_invalid",
        severity: "critical",
        message: "NEXT_PUBLIC_APP_URL is not a valid URL.",
      });
    }
  }

  if (!isTruthy(process.env.STRIPE_SECRET_KEY)) {
    issues.push({
      code: "stripe_secret_key_missing",
      severity: "critical",
      message: "STRIPE_SECRET_KEY must be set — checkout, webhooks, and billing integrations require it.",
    });
  } else {
    const sk = process.env.STRIPE_SECRET_KEY!.trim();
    if (sk.startsWith("sk_test_")) {
      issues.push({
        code: "stripe_secret_key_test_mode",
        severity: "warning",
        message:
          "STRIPE_SECRET_KEY is sk_test_ — use sk_live_ for real production billing (or accept test mode deliberately).",
      });
    }
  }

  if (!isTruthy(process.env.STRIPE_WEBHOOK_SECRET)) {
    issues.push({
      code: "stripe_webhook_secret_missing",
      severity: "critical",
      message: "STRIPE_WEBHOOK_SECRET must be set — webhook signature verification will reject events.",
    });
  }

  if (!isTruthy(process.env.SPACES_KEY) || !isTruthy(process.env.SPACES_SECRET)) {
    issues.push({
      code: "spaces_credentials_missing",
      severity: "critical",
      message:
        "SPACES_KEY and SPACES_SECRET must be set — DigitalOcean Spaces uploads and /api/marketing-assets require them.",
    });
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

/**
 * When true, `runProductionEnvGuard` exits on any **critical** issue.
 * In production, defaults to **off** so optional integration/env drift does not take down the whole site.
 */
export function strictProductionEnvEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const v = process.env.NN_STRICT_PRODUCTION_ENV?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** `next build` often runs with NODE_ENV=production without production secrets — skip fail-fast until runtime. */
function isNextCompilerBuildPhase(): boolean {
  const p = process.env.NEXT_PHASE;
  return p === "phase-production-build" || p === "phase-development-build";
}

/**
 * Logs issues to stderr; exits with code 1 when {@link strictProductionEnvEnabled} and any **critical** issue exists.
 */
export function runProductionEnvGuard(): void {
  if (isNextCompilerBuildPhase()) return;

  const issues = collectProductionEnvIssues();
  if (issues.length === 0) return;

  for (const i of issues) {
    const level = i.severity === "critical" ? "critical" : "warning";
    console.error(`[nursenest-core] env_guard ${level} code=${i.code} — ${i.message}`);
  }

  const critical = issues.filter((i) => i.severity === "critical");
  if (strictProductionEnvEnabled() && critical.length > 0) {
    console.error(
      `[nursenest-core] env_guard: exiting due to ${critical.length} critical issue(s). Fix env vars or unset NN_STRICT_PRODUCTION_ENV to return to log-only startup mode.`,
    );
    process.exit(1);
  }
}
