#!/usr/bin/env npx tsx
/**
 * Forwards to `generate-patho-pharm-longtail-posts.mts` after mapping CLI flags.
 * Primary terminal blog CLI is `npm run generate:blogs` → `scripts/blog-ai-generate.ts`.
 *
 * Run this patho/pharm batch forwarder via:
 *   `npm run blog:patho-pharm-longtail:forward -- --limit 5`
 *
 * `--limit N` / `--limit=N` → `TARGET_COUNT` (see that script’s env contract).
 * `--dry-run` forces `APPLY_BLOG_GENERATION=0` (no DB writes; strict dry-run gates still apply unless PATHO_PHARM_RELAX_DRY_RUN=1).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..", "..");
const targetRel = "scripts/blog/generate-patho-pharm-longtail-posts.mts";

const argv = process.argv.slice(2);
const env: NodeJS.ProcessEnv = { ...process.env };
const forward: string[] = [];
let dryRun = false;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i]!;
  if (a === "--dry-run") {
    dryRun = true;
    continue;
  }
  if (a === "--limit" && argv[i + 1]) {
    env.TARGET_COUNT = String(argv[i + 1]);
    i += 1;
    continue;
  }
  if (a.startsWith("--limit=")) {
    env.TARGET_COUNT = a.slice("--limit=".length);
    continue;
  }
  forward.push(a);
}

if (dryRun) {
  env.APPLY_BLOG_GENERATION = "0";
}

const r = spawnSync(process.execPath, ["--import", "tsx", targetRel, ...forward], {
  cwd: pkgRoot,
  env,
  stdio: "inherit",
});

process.exit(typeof r.status === "number" ? r.status : 1);
