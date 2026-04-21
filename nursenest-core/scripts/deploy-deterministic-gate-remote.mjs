#!/usr/bin/env node
/**
 * Post-deploy / staging hardening gate (remote only).
 *
 * Requires:
 *   - `BASE_URL` (https://…)
 *   - Playwright env for smoke-production (QA_* / E2E_* as in docs/release-verification.md)
 *
 * Runs (in order):
 *   1) release-health (API + healthz burst)
 *   2) post-deploy smoke (public home)
 *   3) One `/_next/static/css/*.css` asset returns `text/css`
 *   4) `qa:verify:production:core` (guest, login, free, paid, admin — skips missing creds)
 *
 * Build-time checks (single compile, standalone on disk) belong in CI after `docker build`
 * or in the image build logs — see docs/deploy-deterministic-docker.md.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const base = process.env.BASE_URL?.trim();
if (!base?.startsWith("http")) {
  console.error("[deploy-deterministic-gate-remote] Set BASE_URL=https://… (remote origin only).");
  process.exit(1);
}

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = {
  ...process.env,
  PLAYWRIGHT_SKIP_WEB_SERVER: "1",
  BASE_URL: base,
};

function runNpm(script) {
  const r = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", script], {
    cwd: pkgRoot,
    stdio: "inherit",
    env,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function assertCssChunk() {
  const homeRes = await fetch(base.replace(/\/$/, "") + "/", { redirect: "follow" });
  if (!homeRes.ok) {
    console.error(`[deploy-deterministic-gate-remote] Home fetch failed: ${homeRes.status}`);
    process.exit(1);
  }
  const html = await homeRes.text();
  const m = html.match(/\/_next\/static\/css\/[^"'>\s]+\.css/);
  if (!m) {
    console.error("[deploy-deterministic-gate-remote] No /_next/static/css/*.css reference in HTML.");
    process.exit(1);
  }
  const cssUrl = new URL(m[0], homeRes.url).href;
  const cssRes = await fetch(cssUrl, { headers: { Accept: "text/css,*/*;q=0.1" } });
  const ct = (cssRes.headers.get("content-type") ?? "").toLowerCase();
  if (!ct.includes("text/css")) {
    console.error(`[deploy-deterministic-gate-remote] Expected text/css for ${cssUrl}, got: ${ct || "(empty)"}`);
    process.exit(1);
  }
  console.log(`[deploy-deterministic-gate-remote] OK CSS: ${cssUrl}`);
}

runNpm("qa:release-gate:health");
runNpm("qa:post-deploy-smoke");
await assertCssChunk();
runNpm("qa:verify:production:core");
