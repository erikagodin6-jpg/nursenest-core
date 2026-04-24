/**
 * Strict DATABASE_URL contract for runtime and CLI scripts.
 *
 * - Rejects Docker image build-time placeholder URLs (see Dockerfile history).
 * - Never logs credentials — only masked host + source hints (`[nn-db-contract]`).
 *
 * Opt-out (rare): `NN_SKIP_DATABASE_ENV_CONTRACT=1` (e.g. isolated unit tests that unset DATABASE_URL).
 */

/** Substring match for the historical Docker build ARG default (must never be used as a real DB). */
export const DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER = "127.0.0.1:5432/postgres";

/**
 * Typical docker-compose / local default credentials + loopback host (must not be treated as production).
 * Intentionally substring-based so encoded URLs still match when decoded into the same shape.
 */
export const REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS = "postgres:postgres@127.0.0.1";

export type DatabaseUrlContractSource = "process_env" | "dotenv" | "unknown";

export type RequireDatabaseEnvOptions = {
  /** Label for logs (e.g. `script-env-bootstrap`, `app-env-bootstrap`). */
  context?: string;
  /** How DATABASE_URL entered the process (dotenv vs shell). */
  urlSource?: DatabaseUrlContractSource;
};

function safeArgvJoin(): string {
  try {
    const g = globalThis as unknown as { process?: { argv?: readonly string[] } };
    const argv = g.process?.argv;
    if (!Array.isArray(argv)) return "";
    return argv.join(" ");
  } catch {
    return "";
  }
}

/**
 * Phases where the app or Prisma must not require a production DATABASE_URL (compile/codegen only).
 */
export function isDatabaseContractSkippedPhase(): boolean {
  if (process.env.NN_SKIP_DATABASE_ENV_CONTRACT === "1") return true;
  const argv = safeArgvJoin();
  const lifecycle = process.env.npm_lifecycle_event ?? "";
  if (lifecycle === "build") return true;
  if (argv.includes("next build")) return true;
  if (/prisma\s+generate\b/i.test(argv)) return true;
  // `npm run db:generate` → `tsx scripts/run-prisma-with-env.mts generate` (no `prisma` token in argv).
  if (/run-prisma-with-env\.(?:mts?|cjs|js)\s+generate\b/i.test(argv)) return true;
  if (process.env.NN_APP_PLATFORM_BUILD === "true") return true;
  return false;
}

/** True when `DATABASE_URL` matches known localhost / image-default placeholders (never production). */
export function isRejectedRuntimePlaceholderDatabaseUrl(url: string): boolean {
  const t = url.trim();
  if (t.includes(DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER)) return true;
  if (t.includes(REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS)) return true;
  return false;
}

/** @alias Prefer {@link isRejectedRuntimePlaceholderDatabaseUrl} in new code. */
export function isDockerBuildPlaceholderDatabaseUrl(url: string): boolean {
  return isRejectedRuntimePlaceholderDatabaseUrl(url);
}

/**
 * True when hostname is not local loopback / *.local (rough production-vs-dev signal for logging only).
 */
export function isProductionLikeDatabaseHost(urlString: string): boolean {
  try {
    const u = new URL(urlString);
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1" || h === "::1") return false;
    if (h.endsWith(".local")) return false;
    if (h === "0.0.0.0") return false;
    return true;
  } catch {
    return false;
  }
}

/** Masks middle labels; keeps port for ops correlation without exposing user/password. */
export function maskDatabaseUrlHostForLog(urlString: string): { host: string; port: string } {
  try {
    const u = new URL(urlString);
    const host = u.hostname;
    const port = u.port || (u.protocol === "postgresql:" || u.protocol === "postgres:" ? "5432" : "");
    if (!host) return { host: "(unparseable)", port: port || "?" };
    const parts = host.split(".").filter(Boolean);
    if (parts.length <= 1) {
      return { host: `${host.slice(0, 1)}***`, port: port || "default" };
    }
    const tld = parts.slice(-2).join(".");
    const first = parts[0]!;
    return { host: `${first.slice(0, 1)}***.${tld}`, port: port || "default" };
  } catch {
    return { host: "(unparseable)", port: "?" };
  }
}

let dbContractLogEmitted = false;

function logDatabaseContractLine(payload: Record<string, string | boolean>): void {
  if (dbContractLogEmitted) return;
  dbContractLogEmitted = true;
  console.info(`[nn-db-contract] ${JSON.stringify(payload)}`);
}

/**
 * Validates DATABASE_URL and returns the trimmed value.
 *
 * @throws Error when missing or when a known localhost placeholder is detected.
 */
export function requireDatabaseEnv(options?: RequireDatabaseEnvOptions): string {
  if (process.env.NN_SKIP_DATABASE_ENV_CONTRACT === "1") {
    const v = process.env.DATABASE_URL?.trim() ?? "";
    return v;
  }

  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "DATABASE_URL is missing in runtime environment (not build ARG). Ensure .env.local or runtime env is set.",
    );
  }

  if (isRejectedRuntimePlaceholderDatabaseUrl(raw)) {
    throw new Error(
      "DATABASE_URL matches a localhost placeholder (Docker default or postgres:postgres@127.0.0.1). Refusing to connect.",
    );
  }

  const { host, port } = maskDatabaseUrlHostForLog(raw);
  const isProductionDb = isProductionLikeDatabaseHost(raw);
  logDatabaseContractLine({
    context: options?.context ?? "requireDatabaseEnv",
    database_url_source: options?.urlSource ?? "unknown",
    host_masked: host,
    port: port,
    isProductionDb,
  });

  return raw;
}

/**
 * App / Prisma env-bootstrap hook: enforce contract only when not in a compile-only phase.
 *
 * - **Placeholder URL:** always throws (even in development).
 * - **Missing URL:** throws only in `NODE_ENV=production` runtime (development may run without a DB for static paths).
 */
export function assertRuntimeDatabaseEnvContract(): void {
  const raw = process.env.DATABASE_URL?.trim();
  if (raw && isRejectedRuntimePlaceholderDatabaseUrl(raw)) {
    throw new Error(
      "DATABASE_URL matches a localhost placeholder (Docker default or postgres:postgres@127.0.0.1). Refusing to connect.",
    );
  }

  if (isDatabaseContractSkippedPhase()) return;

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_URL is missing in runtime environment (not build ARG). Ensure .env.local or runtime env is set.",
      );
    }
    return;
  }

  const { host, port } = maskDatabaseUrlHostForLog(raw);
  logDatabaseContractLine({
    context: "app-env-bootstrap",
    database_url_source: "process_env",
    host_masked: host,
    port,
    isProductionDb: isProductionLikeDatabaseHost(raw),
  });
}
