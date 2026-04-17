/**
 * Starts `next dev` **without** `DIRECT_URL` / `DATABASE_DIRECT_URL` in the process environment while
 * **`DATABASE_URL` is set**. `src/lib/db/env-bootstrap.ts` must derive `DIRECT_URL` from the pooled URL
 * so Prisma init does not throw.
 *
 * **Note:** If `.env.local` defines `DIRECT_URL`, Next may still load it. Prefer CI/shell env only, or
 * temporarily remove that line when running locally.
 *
 * ```
 * node scripts/check-e2e-database-connect.cjs && npx playwright test -c playwright.missing-direct-url.config.ts
 * ```
 */
import "./playwright.env";
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

function webServerEnvForMissingDirectUrl(): NodeJS.ProcessEnv {
  const db = process.env.DATABASE_URL?.trim();
  if (!db) {
    throw new Error(
      "[playwright.missing-direct-url.config] DATABASE_URL must be set (same DB you use for E2E).",
    );
  }
  const out = { ...process.env } as Record<string, string | undefined>;
  delete out.DIRECT_URL;
  delete out.DATABASE_DIRECT_URL;
  out.DATABASE_URL = db;
  return out as NodeJS.ProcessEnv;
}

function localDevWebServer() {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return undefined;
  let origin: URL;
  try {
    origin = new URL(baseURL);
  } catch {
    return undefined;
  }
  const host = origin.hostname;
  if (host !== "127.0.0.1" && host !== "localhost") return undefined;
  const port = origin.port || "3000";
  const secret = process.env.NEXTAUTH_SECRET?.trim() || "playwright-e2e-local-secret";
  const bindHost = host;
  const env = webServerEnvForMissingDirectUrl();
  env.RUN_HEAVY_BUILD_TASKS = "false";
  env.NEXTAUTH_SECRET = secret;
  env.AUTH_URL = origin.origin;
  env.NEXTAUTH_URL = origin.origin;

  return {
    command: `npm run dev -- --hostname ${bindHost} --port ${port}`,
    url: origin.origin,
    reuseExistingServer: !process.env.CI,
    timeout: 420_000,
    env,
  } as const;
}

const e2eWebServer = localDevWebServer();

export default defineConfig({
  ...(e2eWebServer ? { webServer: e2eWebServer } : {}),
  testDir: ".",
  testMatch: [/tests\/e2e\/release\/missing-direct-url-healthz\.spec\.ts$/],
  testIgnore: [/^\.next[\\/]/, /[\\/]\.next[\\/]/, /[\\/]node_modules[\\/]/, /[\\/]dist[\\/]/],
  fullyParallel: false,
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 30_000 },
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
