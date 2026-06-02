/**
 * Centralized environment diagnostics for CLI and tooling.
 * Never logs raw secrets — only presence flags, masked hosts, and stable fingerprints.
 */
import { databaseUrlDriftAuditPublic, evaluateDatabaseUrlShape } from "@/lib/db/database-url-drift-audit";
import {
  isProductionLikeDatabaseHost,
  isRejectedRuntimePlaceholderDatabaseUrl,
} from "@/lib/env/require-database-env";
import { looksLikeSecretMaterial } from "@/lib/env/central-env-validation";
import { collectProductionEnvIssues, type EnvIssue } from "@/lib/env/production-env-guard";

export type EnvDiagnosticSeverity = "ok" | "info" | "warn" | "error";

export type EnvDiagnostic = {
  code: string;
  severity: EnvDiagnosticSeverity;
  message: string;
  hints?: string[];
};

export type EnvDiagnosticsReport = {
  profile: "dev" | "ci" | "production";
  diagnostics: EnvDiagnostic[];
  database?: {
    fingerprintPrefix10: string;
    host: string;
    connectionMode: string;
    maskedSummary: string;
  } | null;
  summary: { ok: number; info: number; warn: number; error: number };
  exitCode: number;
};

function isTruthy(v: string | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

/** Redact hostname for CLI/JSON output (aligns with scripts/lib/load-runtime-env.mjs maskHost). */
function maskHost(hostname: string): string {
  if (!hostname) return "(missing)";
  if (hostname.length <= 6) return "***";
  const [firstLabel = hostname] = hostname.split(".");
  const suffix = hostname.includes(".") ? hostname.slice(hostname.indexOf(".")) : hostname.slice(-3);
  return `${firstLabel.slice(0, 1)}***${suffix}`;
}

function postgresUrlToHttpUrl(raw: string): string {
  return raw.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:");
}

function parseDbUrl(raw: string): URL | null {
  try {
    return new URL(postgresUrlToHttpUrl(raw.trim()));
  } catch {
    return null;
  }
}

function mapProductionIssue(i: EnvIssue): EnvDiagnostic {
  return {
    code: i.code,
    severity: i.severity === "critical" ? "error" : "warn",
    message: i.message,
  };
}

function collectNextPublicSecretSurfaceIssues(): EnvDiagnostic[] {
  const out: EnvDiagnostic[] = [];
  for (const [key, val] of Object.entries(process.env)) {
    if (!key.startsWith("NEXT_PUBLIC_")) continue;
    if (!isTruthy(val)) continue;
    if (!looksLikeSecretMaterial(val!)) continue;
    out.push({
      code: "next_public_secret_shaped_value",
      severity: "error",
      message: `${key} appears to contain secret-shaped data — never expose keys or connection strings via NEXT_PUBLIC_.`,
      hints: ["Move server-only secrets to server env without NEXT_PUBLIC_ prefix.", "See central-env-validation.ts."],
    });
  }
  return out;
}

function collectAuthUrlConflictIssues(): EnvDiagnostic[] {
  const authUrl = process.env.AUTH_URL?.trim();
  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  if (!authUrl || !nextAuthUrl) return [];
  try {
    const a = new URL(authUrl);
    const b = new URL(nextAuthUrl);
    const ao = `${a.protocol}//${a.host}`;
    const bo = `${b.protocol}//${b.host}`;
    if (ao !== bo) {
      return [
        {
          code: "auth_url_conflict",
          severity: "error",
          message: `AUTH_URL (${ao}) and NEXTAUTH_URL (${bo}) disagree — pick one canonical public origin.`,
          hints: ["Prefer AUTH_URL (Auth.js); remove NEXTAUTH_URL or align values."],
        },
      ];
    }
  } catch {
    return [
      {
        code: "auth_url_unparseable",
        severity: "error",
        message: "AUTH_URL or NEXTAUTH_URL is not a valid absolute URL.",
      },
    ];
  }
  return [];
}

function collectDualSecretConflict(): EnvDiagnostic[] {
  const a = process.env.AUTH_SECRET?.trim();
  const b = process.env.NEXTAUTH_SECRET?.trim();
  if (!a || !b || a === b) return [];
  return [
    {
      code: "dual_auth_secret_mismatch",
      severity: "warn",
      message: "Both AUTH_SECRET and NEXTAUTH_SECRET are set to different values — runtime prefers AUTH_SECRET; remove unused secret to avoid rotation confusion.",
    },
  ];
}

function collectDirectUrlPrismaHints(): EnvDiagnostic[] {
  const db = process.env.DATABASE_URL?.trim();
  const direct = process.env.DIRECT_URL?.trim() ?? process.env.DATABASE_DIRECT_URL?.trim();
  if (!db) return [];
  const u = parseDbUrl(db);
  if (!u) return [];
  const pgbouncer = u.searchParams.get("pgbouncer")?.toLowerCase();
  const pooler = pgbouncer === "true" || pgbouncer === "1" || u.port === "6432";
  if (pooler && !isTruthy(direct)) {
    return [
      {
        code: "direct_url_missing_for_pooler",
        severity: "warn",
        message:
          "DATABASE_URL looks like a pooler / PgBouncer URL but DIRECT_URL is unset — Prisma Migrate and some introspection paths need a direct (non-pooler) Postgres URL.",
        hints: ["Set DIRECT_URL to the provider direct connection string (see schema.prisma directUrl)."],
      },
    ];
  }
  if (pooler && isTruthy(direct)) {
    const d = parseDbUrl(direct!);
    if (d && u.hostname === d.hostname && u.port === d.port) {
      return [
        {
          code: "direct_url_same_endpoint_as_pooled",
          severity: "info",
          message: "DIRECT_URL host/port matches DATABASE_URL — migrations may still fail if the pooled URL uses pgbouncer=true on the same port; confirm DIRECT_URL bypasses the pooler.",
        },
      ];
    }
  }
  return [];
}

function collectPosthogPresence(profile: EnvDiagnosticsReport["profile"]): EnvDiagnostic[] {
  if (profile === "ci") return [];
  const server = isTruthy(process.env.POSTHOG_KEY);
  const pub = isTruthy(process.env.NEXT_PUBLIC_POSTHOG_KEY);
  const admin = isTruthy(process.env.POSTHOG_PERSONAL_API_KEY) && isTruthy(process.env.POSTHOG_PROJECT_ID);
  if (!server && !pub) {
    return [
      {
        code: "posthog_optional_unconfigured",
        severity: "info",
        message: "PostHog product analytics keys are unset — client/server capture may be disabled.",
      },
    ];
  }
  if (!admin && profile === "production") {
    return [
      {
        code: "posthog_admin_optional",
        severity: "info",
        message: "POSTHOG_PERSONAL_API_KEY / POSTHOG_PROJECT_ID unset — admin dashboards that query PostHog will stay empty.",
      },
    ];
  }
  return [];
}

function collectReliabilityAndCron(profile: EnvDiagnosticsReport["profile"]): EnvDiagnostic[] {
  const out: EnvDiagnostic[] = [];
  const prodLike =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    profile === "production";
  if (prodLike && !isTruthy(process.env.NURSENEST_RELIABILITY_SECRET)) {
    out.push({
      code: "reliability_secret_optional",
      severity: "info",
      message: "NURSENEST_RELIABILITY_SECRET is unset — internal reliability probe routes stay locked unless configured.",
    });
  }
  return out;
}

function collectI18nHints(): EnvDiagnostic[] {
  const out: EnvDiagnostic[] = [];
  if (process.env.SKIP_I18N_PREBUILD === "1") {
    out.push({
      code: "i18n_prebuild_skipped",
      severity: "info",
      message: "SKIP_I18N_PREBUILD=1 — marketing locale merge steps were skipped (common in CI low-RAM builds).",
    });
  }
  if (process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT === "true") {
    out.push({
      code: "i18n_multilingual_rollout_on",
      severity: "ok",
      message: "NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT=true — multilingual marketing surfaces enabled.",
    });
  }
  return out;
}

function collectDeploymentHints(): EnvDiagnostic[] {
  const out: EnvDiagnostic[] = [];
  const vercel = process.env.VERCEL_URL?.trim();
  const app = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (vercel && app) {
    try {
      const v = new URL(`https://${vercel}`);
      const a = new URL(app);
      if (v.hostname !== a.hostname) {
        out.push({
          code: "vercel_url_vs_public_app_url",
          severity: "info",
          message: `VERCEL_URL host (${v.hostname}) differs from NEXT_PUBLIC_APP_URL host (${a.hostname}) — expected on preview; ensure billing/auth callbacks use NEXT_PUBLIC_APP_URL.`,
        });
      }
    } catch {
      /* ignore */
    }
  }
  if (isTruthy(process.env.PROD_DATABASE_URL)) {
    out.push({
      code: "legacy_prod_database_url_present",
      severity: "warn",
      message: "PROD_DATABASE_URL is set — legacy; runtime uses DATABASE_URL only. Remove PROD_DATABASE_URL to avoid drift.",
    });
  }
  return out;
}

function collectLocalhostInProductionLike(): EnvDiagnostic[] {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return [];
  const prodLike =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.NN_ENFORCE_PRODUCTION_DB_HOST === "1";
  if (!prodLike) return [];
  if (!isProductionLikeDatabaseHost(raw)) {
    if (isRejectedRuntimePlaceholderDatabaseUrl(raw)) {
      return [
        {
          code: "database_url_placeholder_in_production_like",
          severity: "error",
          message: "DATABASE_URL points to a known local/dev placeholder while environment looks like production — fix before deploy.",
        },
      ];
    }
    return [
      {
        code: "database_url_non_production_host",
        severity: "warn",
        message: "DATABASE_URL host is loopback/local while NODE_ENV or VERCEL_ENV suggests production-like runtime — confirm this is intentional.",
      },
    ];
  }
  return [];
}

function summarize(diagnostics: EnvDiagnostic[]): EnvDiagnosticsReport["summary"] {
  const summary = { ok: 0, info: 0, warn: 0, error: 0 };
  for (const d of diagnostics) {
    summary[d.severity] += 1;
  }
  return summary;
}

export type BuildEnvDiagnosticsReportOptions = {
  profile: EnvDiagnosticsReport["profile"];
  /** When true, warnings also produce exit code 1 */
  strict?: boolean;
};

/**
 * Build a structured diagnostics report for the current `process.env`.
 * Call after dotenv / runtime env loaders have populated `process.env`.
 */
export function buildEnvDiagnosticsReport(opts: BuildEnvDiagnosticsReportOptions): EnvDiagnosticsReport {
  const { profile, strict = false } = opts;
  const diagnostics: EnvDiagnostic[] = [];

  const rawDb = process.env.DATABASE_URL?.trim() ?? "";
  if (!rawDb) {
    if (profile === "ci") {
      diagnostics.push({
        code: "database_url_absent_ci",
        severity: "ok",
        message: "DATABASE_URL unset — acceptable in CI jobs without database secrets.",
      });
    } else if (profile === "production") {
      /* collectProductionEnvIssues covers missing DATABASE_URL as critical */
    } else {
      diagnostics.push({
        code: "database_url_absent_dev",
        severity: "info",
        message: "DATABASE_URL unset — set in .env.local when working on Prisma-backed routes or data scripts.",
      });
    }
  } else {
    const shape = evaluateDatabaseUrlShape();
    if (!shape.ok) {
      diagnostics.push({
        code: shape.reason,
        severity: "error",
        message:
          shape.reason === "db_missing_url"
            ? "DATABASE_URL is missing — Prisma and server data paths cannot run."
            : "DATABASE_URL is set but not a parseable postgres URL.",
      });
    } else {
      const audit = databaseUrlDriftAuditPublic(rawDb);
      if (audit) {
        diagnostics.push({
          code: "database_url_ok",
          severity: "ok",
          message: `DATABASE_URL parseable (host=${maskHost(audit.host)}, mode=${audit.connectionMode}).`,
        });
      }
    }
  }

  diagnostics.push(...collectAuthUrlConflictIssues());
  diagnostics.push(...collectDualSecretConflict());
  diagnostics.push(...collectDirectUrlPrismaHints());
  diagnostics.push(...collectLocalhostInProductionLike());
  diagnostics.push(...collectDeploymentHints());
  diagnostics.push(...collectI18nHints());
  diagnostics.push(...collectPosthogPresence(profile));
  diagnostics.push(...collectReliabilityAndCron(profile));

  if (profile === "ci" || profile === "production") {
    diagnostics.push(...collectNextPublicSecretSurfaceIssues());
  }

  if (profile === "production") {
    const productionEnv: NodeJS.ProcessEnv = { ...process.env };
    productionEnv["NODE" + "_ENV"] = "production";
    for (const issue of collectProductionEnvIssues(productionEnv)) {
      diagnostics.push(mapProductionIssue(issue));
    }
  }

  const summary = summarize(diagnostics);
  const hasError = diagnostics.some((d) => d.severity === "error");
  const hasWarn = diagnostics.some((d) => d.severity === "warn");
  const exitCode = hasError || (strict && hasWarn) ? 1 : 0;

  const audit = rawDb ? databaseUrlDriftAuditPublic(rawDb) : null;

  return {
    profile,
    diagnostics,
    database: audit
      ? {
          fingerprintPrefix10: audit.fingerprintPrefix10,
          host: maskHost(audit.host),
          connectionMode: audit.connectionMode,
          maskedSummary: `${maskHost(audit.host)}:${audit.port}/${audit.database}`,
        }
      : null,
    summary,
    exitCode,
  };
}

export function formatEnvDiagnosticsReportHuman(report: EnvDiagnosticsReport): string {
  const lines: string[] = [];
  lines.push(`[env:validate] profile=${report.profile}`);
  if (report.database) {
    lines.push(
      `[env:validate] database fingerprint_prefix10=${report.database.fingerprintPrefix10} ` +
        `host=${report.database.host} mode=${report.database.connectionMode}`,
    );
  }
  lines.push(
    `[env:validate] summary ok=${report.summary.ok} info=${report.summary.info} warn=${report.summary.warn} error=${report.summary.error}`,
  );
  for (const d of report.diagnostics) {
    const hint = d.hints?.length ? ` — ${d.hints.join(" | ")}` : "";
    lines.push(`[env:validate] [${d.severity}] ${d.code}: ${d.message}${hint}`);
  }
  if (report.exitCode !== 0) {
    lines.push(`[env:validate] FAILED (exit ${report.exitCode}) — fix errors${report.profile === "dev" ? "" : " or run with a looser profile"} or see reports/environment-system.md.`);
  } else {
    lines.push("[env:validate] OK");
  }
  return lines.join("\n");
}

export function formatEnvDiagnosticsReportJson(report: EnvDiagnosticsReport): string {
  const safe = {
    profile: report.profile,
    summary: report.summary,
    exitCode: report.exitCode,
    database: report.database,
    diagnostics: report.diagnostics.map((d) => ({
      ...d,
      hints: d.hints,
    })),
  };
  return JSON.stringify(safe, null, 2);
}

/**
 * One-line boot log (no values). Call from Node instrumentation if desired.
 */
export function emitEnvDiagnosticsBootSummary(): void {
  const raw = process.env.DATABASE_URL?.trim();
  const audit = raw ? databaseUrlDriftAuditPublic(raw) : null;
  const fp = audit?.fingerprintPrefix10 ?? "(no-db)";
  console.error(`[nursenest-core] env_diagnostics_boot fingerprint_prefix10=${fp} database_configured=${raw ? "1" : "0"}`);
}
