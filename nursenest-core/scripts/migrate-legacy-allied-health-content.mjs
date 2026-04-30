#!/usr/bin/env node
/**
 * Legacy Allied inventory + safe migration orchestration (dry-run default).
 *
 * Does NOT write to the database unless --apply=true (not implemented here — use
 * `npx tsx scripts/import-allied-json-to-prisma.ts` from repo root with JSON exports).
 *
 * Usage (from nursenest-core/):
 *   node scripts/migrate-legacy-allied-health-content.mjs
 *   node scripts/migrate-legacy-allied-health-content.mjs --professionKey=pharmacy-tech --contentType=questions --limit=20
 *   node scripts/migrate-legacy-allied-health-content.mjs --apply=true   # no-op guard: exits with instructions
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const careerDir = path.join(repoRoot, "client", "src", "data", "career-questions");

function parseArgs(argv) {
  const get = (name) => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    const idx = argv.indexOf(`--${name}`);
    if (idx >= 0 && argv[idx + 1] && !argv[idx + 1].startsWith("--")) return argv[idx + 1];
    return undefined;
  };
  return {
    apply: argv.includes("--apply=true"),
    publish: argv.includes("--publish=true"),
    update: argv.includes("--update=true"),
    professionKey: get("professionKey")?.trim().toLowerCase() ?? "",
    contentType: (get("contentType") ?? "all").trim().toLowerCase(),
    limit: Math.min(500, Math.max(1, Number(get("limit") ?? "50") || 50)),
  };
}

function inferProfessionFromFilename(name) {
  const base = name.replace(/\.ts$/i, "");
  const m = base.match(/^([a-z0-9-]+?)(-questions(?:-|$))/i);
  if (!m) return null;
  const stem = m[1].replace(/-batch\d+$/i, "").replace(/-expansion.*$/i, "");
  const map = {
    "pharmacy-tech": "pharmacy-tech",
    rrt: "respiratory",
    mlt: "mlt",
    imaging: "imaging",
    ota: "ota",
    pta: "pta",
    paramedic: "paramedic",
    sonography: "sonography",
    "social-worker": "social-work",
  };
  return map[stem] ?? stem.replace(/_/g, "-");
}

function main() {
  const argv = process.argv.slice(2);
  const opts = parseArgs(argv);
  const log = (tag, obj) => console.log(tag, JSON.stringify(obj));

  if (opts.apply) {
    console.error(
      "[ALLIED_LEGACY_NEEDS_REVIEW] Database apply is not implemented in this stub. Use repo-root `scripts/import-allied-json-to-prisma.ts --apply` with vetted JSON exports.",
    );
    process.exitCode = 2;
    return;
  }
  if (opts.publish) {
    console.error("[ALLIED_LEGACY_NEEDS_REVIEW] --publish=true is intentionally unsupported in dry-run tooling.");
    process.exitCode = 2;
    return;
  }

  if (!fs.existsSync(careerDir)) {
    log("[LEGACY_ALLIED_CONTENT_FOUND]", { sourcePath: careerDir, contentType: "none", count: 0, note: "missing_dir" });
    return;
  }

  const files = fs.readdirSync(careerDir).filter((f) => /^[a-z0-9-]+-questions.*\.ts$/i.test(f));
  const byProfession = new Map();
  for (const f of files) {
    const inferred = inferProfessionFromFilename(f);
    const key = opts.professionKey || inferred || "unmapped";
    if (opts.professionKey && inferred && inferred !== opts.professionKey) continue;
    if (!byProfession.has(key)) byProfession.set(key, []);
    byProfession.get(key).push(f);
  }

  let shown = 0;
  for (const [profKey, list] of byProfession) {
    if (shown >= opts.limit) break;
    const sampleTitles = list.slice(0, 3);
    log("[LEGACY_ALLIED_CONTENT_FOUND]", {
      sourcePath: careerDir,
      contentType: opts.contentType,
      inferredProfessionKey: profKey,
      count: list.length,
      sampleTitles,
    });
    log("[ALLIED_LEGACY_SKIPPED_DUPLICATE]", {
      reason: "dry_run_default",
      professionKey: profKey,
      filesConsidered: Math.min(list.length, opts.limit),
    });
    shown++;
  }
}

main();
