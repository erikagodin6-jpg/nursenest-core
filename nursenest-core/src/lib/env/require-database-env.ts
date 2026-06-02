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

/**
 * Token sequences that appear only in .env.example / template files, never in real credentials.
 * These are checked REGARDLESS of NN_SKIP_DATABASE_ENV_CONTRACT so a mis-copied template can
 * never silently reach Prisma's connection engine (which would throw "invalid port number").
 *
 * Pattern: the URL-authority section contains literal uppercase placeholder words.
 * e.g. `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
 */
const ENV_TEMPLATE_PLACEHOLDER_MARKERS = [
  ":PORT/",     // literal non-numeric port label from .env.example
  "@HOST:",     // literal hostname label
  "//USER:",    // literal username label
  ":PASSWORD@", // literal password label
  ":port/",     // lowercase variant
  "@host:",     // lowercase variant
  "//user:",    // lowercase variant
  ":password@", // lowercase variant
] as const;

/**
 * Returns true if the URL contains a template placeholder token from `.env.example`.
 * This check runs before the NN_SKIP_DATABASE_ENV_CONTRACT bypass to prevent template
 * URLs from reaching Prisma where they throw cryptic "invalid port number" errors.
 */
export function isEnvTemplatePlaceholderDatabaseUrl(url: string): boolean {
  const t = url.trim();
  return ENV_TEMPLATE_PLACEHOLDER_MARKERS.some((marker) => t.includes(marker));
}

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
 *
 * **Important:** Do not skip solely from `NN_APP_PLATFORM_BUILD` — that marker has leaked into runtime
 * environments after deploy-spec merges/restructures, silencing DATABASE_URL checks while Next still needs DB.
 * Prefer `NEXT_PHASE`, literal `next build` argv, and concrete prisma generate entrypoints.
 */
export function isDatabaseContractSkippedPhase(): boolean {
  if (process.env.NN_SKIP_DATABASE_ENV_CONTRACT === "1") return true;
  const argv = safeArgvJoin();
  const lifecycle = process.env.npm_lifecycle_event ?? "";
  const phase = process.env.NEXT_PHASE?.trim();

  if (phase === "phase-production-build" || phase === "phase-development-build") return true;
  if (lifecycle === "build") return true;
  if (lifecycle === "build:lesson-indexes" || lifecycle === "verify:lesson-indexes") return true;
  /** Docker compile entry (`Dockerfile` → `npm run heroku-postbuild`) — never `start` / standalone CMD. */
  if (lifecycle === "heroku-postbuild") return true;
  if (argv.includes("next build")) return true;
  if (argv.includes("run-next-prod-build.mjs")) return true;
  if (argv.includes("run-buildpack-build.mjs")) return true;
  if (argv.includes("build-normalized-lesson-indexes.runner.mts")) return true;
  if (argv.includes("verify-normalized-lesson-indexes.runner.mts")) return true;
  if (/prisma\s+generate\b/i.test(argv)) return true;
  // `npm run db:generate` → `tsx scripts/run-prisma-with-env.mts generate` (no `prisma` token in argv).
  if (/run-prisma-with-env\.(?:mts?|cjs|js)\s+generate\b/i.test(argv)) return true;
  // Docker/CI: `node scripts/prisma-safe.mjs generate` — no substring `prisma generate`.
  if (/prisma-safe\.mjs\s+generate\b/i.test(argv)) return true;
  return false;
}

/**
 * Prisma `generate` only needs a parseable URL; Docker/CI may use a dedicated loopback stub that must never
 * collide with the historical image default (`127.0.0.1:5432/postgres`) or be mistaken for production.
 */
export function isAllowedPrismaCodegenStubDatabaseUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    const h = u.hostname.toLowerCase();
    if (h !== "127.0.0.1" && h !== "localhost") return false;
    const port = u.port || (u.protocol === "postgresql:" || u.protocol === "postgres:" ? "5432" : "");
    if (port !== "65432") return false;
    const db = u.pathname.replace(/^\//, "").split("/")[0] ?? "";
    return db === "nn_prisma_codegen";
  } catch {
    return false;
  }
}

/** True when `DATABASE_URL` matches known localhost / image-default placeholders (never production). */
export function isRejectedRuntimePlaceholderDatabaseUrl(url: string): boolean {
  const t = url.trim();
  if (t.includes(DOCKER_BUILD_PLACEHOLDER_DATABASE_URL_MARKER)) return true;
  if (isAllowedPrismaCodegenStubDatabaseUrl(t)) return false;
  if (t.includes(REJECTED_DEFAULT_POSTGRES_LOCALHOST_CREDENTIALS)) return true;
  if (isEnvTemplatePlaceholderDatabaseUrl(t)) return true;
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
/**
 * Ensures `DATABASE_URL` parses as PostgreSQL (`postgres:` / `postgresql:`) with a hostname.
 * Does not log the URL. Keep aligned with `scripts/runtime-env-guard-bootstrap.mjs`.
 */
export function assertPostgresConnectionStringShape(urlString: string): void {
  const trimmed = urlString.trim();
  const lowered = trimmed.toLowerCase();
  if (!lowered.startsWith("postgresql:") && !lowered.startsWith("postgres:")) {
    throw new Error("DATABASE_URL must use postgresql:// or postgres://.");
  }
  let u: URL;
  try {
    const httpish = trimmed.replace(/^postgresql:/i, "http:").replace(/^postgres:/i, "http:");
    u = new URL(httpish);
  } catch {
    throw new Error("DATABASE_URL is not a parseable PostgreSQL connection string.");
  }
  if (!u.hostname) {
    throw new Error("DATABASE_URL is missing a database host.");
  }
}

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
    // Template placeholder detection runs even when contract is skipped.
    // Without this, `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` silently reaches Prisma
    // which throws a cryptic "invalid port number in database URL" at connection time.
    if (v && isEnvTemplatePlaceholderDatabaseUrl(v)) {
      throw new Error(
        "DATABASE_URL contains .env.example template placeholders (e.g. :PORT/ or @HOST:). " +
        "Copy real credentials from your database provider into .env.local before running scripts.",
      );
    }
    return v;
  }

  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "DATABASE_URL is missing in runtime environment (not build ARG). Ensure .env.local or runtime env is set.",
    );
  }

  assertPostgresConnectionStringShape(raw);

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
      let cwd = ".";
      let scriptPath = "(unavailable)";
      try {
        cwd = process.cwd();
      } catch {
        /* ignore */
      }
      try {
        scriptPath = typeof process.argv[1] === "string" ? process.argv[1] : "(unavailable)";
      } catch {
        /* ignore */
      }
      throw new Error(
        [
          "DATABASE_URL is missing in the first runtime Node process (not build ARG).",
          "Inspect DigitalOcean component env attachment, source_dir, run_command, deployment freshness, rollback state, dotenv precedence, and wrapper env forwarding.",
          "app_name=nursenest-core-next",
          "component_name=web",
          "source_dir=.",
          "run_command=node scripts/start-standalone.mjs",
          `cwd=${cwd}`,
          `script_path=${scriptPath}`,
          "deployment_id=(unavailable)",
          "doctl_verify_runtime=unavailable app_root=(not available in app runtime)",
          `NEXT_PHASE=${process.env.NEXT_PHASE ?? "(unset)"}`,
          `npm_lifecycle_event=${process.env.npm_lifecycle_event ?? "(unset)"}`,
        ].join(" "),
      );
    }
    return;
  }

  assertPostgresConnectionStringShape(raw);

  const { host, port } = maskDatabaseUrlHostForLog(raw);
  logDatabaseContractLine({
    context: "app-env-bootstrap",
    database_url_source: "process_env",
    host_masked: host,
    port,
    isProductionDb: isProductionLikeDatabaseHost(raw),
  });
}
