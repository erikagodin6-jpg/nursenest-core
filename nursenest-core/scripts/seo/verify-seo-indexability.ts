#!/usr/bin/env npx tsx
/**
 * Runs SEO verification scripts in sequence (sitemap deep check, robots, public link crawl).
 * Skips HTTP-heavy steps when `SKIP_SEO_HTTP_VERIFY=1` (e.g. CI without running server).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function run(script: string) {
  const r = spawnSync(process.execPath, ["--import", "tsx", join(root, script)], {
    stdio: "inherit",
    env: process.env,
    cwd: root,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

async function main() {
  if (process.env.SKIP_SEO_HTTP_VERIFY === "1") {
    console.log("[verify:seo-indexability] SKIP_SEO_HTTP_VERIFY=1 — skipping HTTP scripts");
    process.exit(0);
  }
  run("scripts/seo/verify-robots.ts");
  run("scripts/seo/verify-sitemap-urls.ts");
  run("scripts/seo/verify-public-marketing-links.ts");
  console.log("[verify:seo-indexability] all steps OK");
}

await main();
