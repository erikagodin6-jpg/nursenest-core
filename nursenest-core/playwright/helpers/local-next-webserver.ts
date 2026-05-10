/**
 * Shared Playwright `webServer` block for local Next.js (App Router).
 *
 * **Never wire `npm run dev` here** — in this package it starts `server/index.ts`, not `next dev`.
 * Use `npm run dev:next` so `assert-local-auth-secret` + memory shims run consistently.
 *
 * @see docs/runtime/local-runtime-modes.md
 * @see ../../../docs/runtime/playwright-local-workflow.md (git repo root)
 */
export type LocalNextWebServerInput = {
  /** Base URL from PLAYWRIGHT_BASE_URL / BASE_URL / default (may include port). */
  baseURL: string;
  /** Full URL Playwright polls until 2xx (e.g. `${origin}/api/auth/csrf` or `${origin}/`). */
  readyUrl: string;
  timeoutMs?: number;
  /** Merged on top of defaults (NEXTAUTH_SECRET, AUTH_URL, …). */
  envExtra?: Record<string, string | undefined>;
  /**
   * When false, never reuse an existing listener (forces a fresh `webServer` process when local).
   * Default: reuse when not CI and `PLAYWRIGHT_NO_REUSE_WEB_SERVER` is not `1`.
   */
  reuseExistingServer?: boolean;
};

const PLAYWRIGHT_LOCAL_SECRET = "playwright-e2e-local-secret";

export function localNextDevWebServer(input: LocalNextWebServerInput) {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return undefined;

  let origin: URL;
  try {
    origin = new URL(input.baseURL.trim());
  } catch {
    return undefined;
  }

  const host = origin.hostname;
  if (host !== "127.0.0.1" && host !== "localhost") return undefined;

  const port = origin.port || "3000";
  const loopbackHost = host === "localhost" ? "127.0.0.1" : host;
  const secret =
    process.env.NEXTAUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || PLAYWRIGHT_LOCAL_SECRET;
  const dbUrl = process.env.DATABASE_URL?.trim();

  const forceNoReuse = process.env.PLAYWRIGHT_NO_REUSE_WEB_SERVER === "1";
  const reuseExistingServer =
    input.reuseExistingServer ??
    (!forceNoReuse && !process.env.CI);

  const existingNodeOptions = process.env.NODE_OPTIONS?.trim();
  const playwrightHeap = process.env.PLAYWRIGHT_NEXT_HEAP_MB?.trim() || "4096";
  const heapFlag = `--max-old-space-size=${playwrightHeap}`;
  const mergedNodeOptions = existingNodeOptions ? `${existingNodeOptions} ${heapFlag}` : heapFlag;

  const env: Record<string, string> = {
    NODE_OPTIONS: mergedNodeOptions,
    RUN_HEAVY_BUILD_TASKS: "false",
    NEXTAUTH_SECRET: secret,
    AUTH_SECRET: process.env.AUTH_SECRET?.trim() || secret,
    AUTH_URL: origin.origin,
    NEXTAUTH_URL: origin.origin,
    ...(dbUrl ? { DATABASE_URL: dbUrl } : {}),
  };

  if (input.envExtra) {
    for (const [k, v] of Object.entries(input.envExtra)) {
      if (v !== undefined && v !== "") env[k] = v;
    }
  }

  return {
    command: `npm run dev:next -- --hostname ${loopbackHost} --port ${port}`,
    url: input.readyUrl,
    reuseExistingServer,
    timeout: input.timeoutMs ?? 300_000,
    env,
  } as const;
}
