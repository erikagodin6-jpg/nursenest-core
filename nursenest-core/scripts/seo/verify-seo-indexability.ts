#!/usr/bin/env npx tsx
/**
 * Runs SEO verification scripts in sequence (robots → sitemap URL checks → public link crawl).
 * Set `SKIP_SEO_HTTP_VERIFY=1` when no server is listening (CI compile-only).
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");

function run(rel: string) {
  const scriptPath = join(root, rel);
  const r = spawnSync("npx", ["tsx", scriptPath], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: false,
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
