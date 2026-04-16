#!/usr/bin/env node
/**
 * Run the minimal four-group smoke suite (`tests/e2e/smoke-production/**`) via `playwright.smoke.config.ts`.
 * For the legacy broad smoke folder, use `npm run qa:smoke:extended`.
 *
 * - Honors `BASE_URL` (defaults to http://127.0.0.1:3000 when unset).
 * - Sets `PLAYWRIGHT_SKIP_WEB_SERVER=1` when BASE_URL is not localhost (no dev server bootstrap).
 * - Does not mock anything — real browser against the target origin.
 *
 * Usage:
 *   BASE_URL=https://www.example.com QA_PAID_EMAIL=... QA_PAID_PASSWORD=... npm run qa:smoke
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.BASE_URL?.trim() || "http://127.0.0.1:3000";

let host = "";
try {
  host = new URL(baseUrl).hostname;
} catch {
  console.error("[qa:smoke] Invalid BASE_URL:", baseUrl);
  process.exit(1);
}

const isLocal = host === "127.0.0.1" || host === "localhost";
if (!isLocal) {
  process.env.PLAYWRIGHT_SKIP_WEB_SERVER = "1";
}

const env = { ...process.env, BASE_URL: baseUrl };

console.log("");
console.log("=== qa:smoke ===");
console.log(`BASE_URL: ${baseUrl}`);
console.log(`PLAYWRIGHT_SKIP_WEB_SERVER: ${process.env.PLAYWRIGHT_SKIP_WEB_SERVER ?? "(unset)"}`);
console.log("Runner: Guest | Free user | Paid user | Admin user (no mocks).");
console.log("");

const extraArgs = process.argv.slice(2);
const pwArgs = ["playwright", "test", "-c", "playwright.smoke.config.ts", ...extraArgs];

const result = spawnSync("npx", pwArgs, {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});

const code = result.status === 0 ? 0 : (result.status ?? 1);
console.log("");
if (code === 0) {
  console.log("qa:smoke summary: PASS (exit 0)");
} else {
  console.log(`qa:smoke summary: FAIL (exit ${code})`);
}
process.exit(code);
