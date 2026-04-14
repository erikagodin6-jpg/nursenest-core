#!/usr/bin/env npx tsx
/**
 * Read-only audit: classify nursing MCQs vs flashcards vs quarantine from ai_cache JSON.
 * Run from nursenest-core/:
 *   npm run import:audit-nursing -- --file=../data/replit-exports/ai_cache.json
 */
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadJsonRows } from "../../scripts/replit-import/json-load";
import { resolveMonorepoRoot, scanNursingFromRows } from "./lib/scan-nursing-ai-cache";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    const idx = argv.indexOf(`--${name}`);
    if (idx >= 0 && argv[idx + 1] && !argv[idx + 1]!.startsWith("--")) return argv[idx + 1];
    return undefined;
  };
  const file = get("file") ?? path.join(resolveMonorepoRoot(), "data", "replit-exports", "ai_cache.json");
  const jsonOut = get("json-out");
  return { file: path.resolve(file), jsonOut: jsonOut ? path.resolve(jsonOut) : null };
}

async function main() {
  const { file, jsonOut } = parseArgs();
  const repoRoot = resolveMonorepoRoot();
  const exportDirAbs = path.dirname(file);

  if (!fs.existsSync(file)) {
    console.error(JSON.stringify({ error: "file_not_found", file, hint: "Set --file= to your ai_cache.json path" }, null, 2));
    process.exit(1);
  }

  const rows = loadJsonRows(file);
  const scanned = scanNursingFromRows(rows, {
    repoRoot,
    exportDirAbs,
    sourceFileName: path.basename(file),
  });

  const byKind: Record<string, number> = {};
  for (const s of scanned) {
    byKind[s.kind] = (byKind[s.kind] ?? 0) + 1;
  }

  const report = {
    auditedAt: new Date().toISOString(),
    file,
    repoRoot,
    topLevelRows: rows.length,
    classifiedItems: scanned.length,
    byKind,
    sampleMcqStemHashes: scanned
      .filter((s): s is Extract<typeof s, { kind: "mcq_nursing" }> => s.kind === "mcq_nursing")
      .slice(0, 5)
      .map((s) => ({ stemHash: s.value.stemHash, tier: s.value.tier, exam: s.value.exam })),
  };

  console.log(JSON.stringify(report, null, 2));
  if (jsonOut) {
    fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
    fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2), "utf8");
    console.log(JSON.stringify({ wrote: jsonOut }, null, 2));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
