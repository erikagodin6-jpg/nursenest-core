import { spawnSync } from "node:child_process";

/**
 * Blocks until `scripts/qa/wait-for-app-ready.mjs` succeeds (HTTP 200 on core paths + optional CSRF).
 * Skipped when `E2E_SKIP_APP_READY=1` (e.g. exotic harnesses).
 */
export function spawnWaitForAppReady(): void {
  if (process.env.E2E_SKIP_APP_READY === "1") {
    console.log("[spawn-wait-for-app-ready] skipped (E2E_SKIP_APP_READY=1)");
    return;
  }

  const env = {
    ...process.env,
    APP_READY_PATHS:
      process.env.APP_READY_PATHS?.trim() ||
      "/,/login,/app,/pre-nursing,/api/auth/csrf,/app/practice-tests",
    APP_READY_TIMEOUT_MS: process.env.APP_READY_TIMEOUT_MS || "300000",
    APP_READY_AUTH_CSRF: process.env.APP_READY_AUTH_CSRF ?? "1",
  };

  const result = spawnSync(process.execPath, ["scripts/qa/wait-for-app-ready.mjs"], {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  });

  if (result.signal) {
    console.error(`[spawn-wait-for-app-ready] killed by signal ${result.signal}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
