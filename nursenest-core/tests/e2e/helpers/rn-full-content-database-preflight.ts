import type { APIRequestContext } from "@playwright/test";
import type { DatabasePreflightClassification } from "./rn-full-content-phase0-classification";
import { normalizeRnFullContentBaseUrl } from "./rn-full-content-environment";
import pg from "pg";

export type RnDatabasePreflightResult = {
  attempted: boolean;
  /** True when DATABASE_URL was non-empty and a TCP connect was attempted. */
  connectAttempted: boolean;
  classification: DatabasePreflightClassification;
  /** Safe one-line summary (no secrets). */
  safeSummary: string;
  /** Parsed for operator context — never includes password. */
  redactedTarget?: { host: string; port: string; database: string; user: string };
};

function redactConnectionTarget(rawUrl: string): { host: string; port: string; database: string; user: string } | undefined {
  try {
    const u = new URL(rawUrl);
    const path = u.pathname.replace(/^\//, "") || "(default)";
    return {
      host: u.hostname || "(unknown-host)",
      port: u.port || "5432",
      database: path.split("/")[0] || "(default)",
      user: decodeURIComponent(u.username || "(unknown-user)"),
    };
  } catch {
    return undefined;
  }
}

function classifyPgErrorMessage(msg: string): DatabasePreflightClassification {
  const m = msg.toLowerCase();
  if (/password authentication failed|must provide a password|authentication failed.*password/i.test(msg)) {
    return "DB_AUTH_FAILURE";
  }
  if (/econnrefused|connection refused/i.test(m)) return "CONNECTION_REFUSED";
  if (/timeout|etimedout/i.test(m)) return "TIMEOUT";
  if (/enotfound|getaddrinfo|eai_again/i.test(m)) return "DNS_OR_NETWORK";
  return "OTHER";
}

/**
 * Node-side DATABASE_URL connectivity check for RN full-content (Playwright worker).
 * Uses the **Playwright process** `DATABASE_URL` — must match the dev server for meaningful triage.
 */
export async function probeDatabaseUrlFromEnv(): Promise<RnDatabasePreflightResult> {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    return {
      attempted: false,
      connectAttempted: false,
      classification: "SKIPPED_NO_DATABASE_URL",
      safeSummary:
        "DATABASE_URL not set in Playwright process — node `pg` preflight skipped (set it to match the dev server for definitive DB vs QA-password classification).",
    };
  }

  const redactedTarget = redactConnectionTarget(raw);
  const client = new pg.Client({
    connectionString: raw,
    connectionTimeoutMillis: 8000,
  });

  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end().catch(() => {});
    return {
      attempted: true,
      connectAttempted: true,
      classification: "OK",
      safeSummary: "DATABASE_URL accepted by Postgres (SELECT 1 ok).",
      redactedTarget,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const classification = classifyPgErrorMessage(msg);
    await client.end().catch(() => {});
    const safeSummary =
      classification === "DB_AUTH_FAILURE"
        ? "Postgres rejected DATABASE_URL credentials (DB_AUTH_FAILURE — fix DB role / URL; not QA web login password)."
        : `Postgres connect/query failed [${classification}]: ${msg.slice(0, 200)}`;
    return {
      attempted: true,
      connectAttempted: true,
      classification,
      safeSummary,
      redactedTarget,
    };
  }
}

function triStateBool(v: unknown): boolean | null {
  if (v === true || v === false || v === null) return v;
  return null;
}

/**
 * Snapshot from GET /api/health/ready — includes operator-safe `classification` (no raw PG errors).
 */
export type RnDatabaseHealthSnapshot = {
  endpoint: "/api/health/ready";
  httpStatus: number;
  reachable: boolean;
  ok: boolean | null;
  database: string | null;
  classification: string | null;
  latencyMs: number | null;
  readinessTimeoutMs: number | null;
  fetchError: string | null;
};

export async function fetchRnDatabaseHealthSnapshot(
  request: APIRequestContext,
  baseUrl: string,
): Promise<RnDatabaseHealthSnapshot> {
  const origin = normalizeRnFullContentBaseUrl(baseUrl);
  const href = `${origin}/api/health/ready`;
  try {
    const r = await request.get(href, { timeout: 20_000, failOnStatusCode: false });
    const text = await r.text();
    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {
        endpoint: "/api/health/ready",
        httpStatus: r.status(),
        reachable: true,
        ok: null,
        database: null,
        classification: null,
        latencyMs: null,
        readinessTimeoutMs: null,
        fetchError: `non_json_response: ${text.slice(0, 160)}`,
      };
    }
    return {
      endpoint: "/api/health/ready",
      httpStatus: r.status(),
      reachable: true,
      ok: typeof json.ok === "boolean" ? json.ok : null,
      database: typeof json.database === "string" ? json.database : null,
      classification: typeof json.classification === "string" ? json.classification : null,
      latencyMs: typeof json.latencyMs === "number" ? json.latencyMs : null,
      readinessTimeoutMs: typeof json.readinessTimeoutMs === "number" ? json.readinessTimeoutMs : null,
      fetchError: null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      endpoint: "/api/health/ready",
      httpStatus: 0,
      reachable: false,
      ok: null,
      database: null,
      classification: null,
      latencyMs: null,
      readinessTimeoutMs: null,
      fetchError: msg.slice(0, 400),
    };
  }
}

export type RnE2eAccountProbeSnapshot = {
  endpoint: "/api/health/e2e-account-probe";
  httpStatus: number;
  probeEnabledOnServer: boolean;
  databaseClassification: string | null;
  userPresent: boolean | null;
  hasPasswordHash: boolean | null;
  accountLockedOut: boolean | null;
  activePaidSubscription: boolean | null;
  fetchError: string | null;
};

export async function fetchRnE2eAccountProbeSnapshot(
  request: APIRequestContext,
  baseUrl: string,
  email: string,
): Promise<RnE2eAccountProbeSnapshot> {
  const origin = normalizeRnFullContentBaseUrl(baseUrl);
  const href = `${origin}/api/health/e2e-account-probe`;
  try {
    const r = await request.post(href, {
      data: { email },
      headers: { "content-type": "application/json" },
      timeout: 25_000,
      failOnStatusCode: false,
    });
    const text = await r.text();
    if (r.status() === 404) {
      return {
        endpoint: "/api/health/e2e-account-probe",
        httpStatus: 404,
        probeEnabledOnServer: false,
        databaseClassification: null,
        userPresent: null,
        hasPasswordHash: null,
        accountLockedOut: null,
        activePaidSubscription: null,
        fetchError: null,
      };
    }
    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {
        endpoint: "/api/health/e2e-account-probe",
        httpStatus: r.status(),
        probeEnabledOnServer: true,
        databaseClassification: null,
        userPresent: null,
        hasPasswordHash: null,
        accountLockedOut: null,
        activePaidSubscription: null,
        fetchError: `non_json: ${text.slice(0, 160)}`,
      };
    }
    return {
      endpoint: "/api/health/e2e-account-probe",
      httpStatus: r.status(),
      probeEnabledOnServer: true,
      databaseClassification: typeof json.databaseClassification === "string" ? json.databaseClassification : null,
      userPresent: triStateBool(json.userPresent),
      hasPasswordHash: triStateBool(json.hasPasswordHash),
      accountLockedOut: triStateBool(json.accountLockedOut),
      activePaidSubscription: triStateBool(json.activePaidSubscription),
      fetchError: null,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      endpoint: "/api/health/e2e-account-probe",
      httpStatus: 0,
      probeEnabledOnServer: false,
      databaseClassification: null,
      userPresent: null,
      hasPasswordHash: null,
      accountLockedOut: null,
      activePaidSubscription: null,
      fetchError: msg.slice(0, 400),
    };
  }
}
