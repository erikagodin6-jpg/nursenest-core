#!/usr/bin/env node
/**
 * Audit runtime payload / bundle risk: large JSON on disk, client bundles importing content,
 * generated-indexes leaking into app routes.
 * Warn-only unless AUDIT_RUNTIME_PAYLOADS_STRICT=1.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const strict = /^(1|true|yes)$/i.test(String(process.env.AUDIT_RUNTIME_PAYLOADS_STRICT ?? "").trim());

const GIANT_JSON_BYTES = Number(process.env.AUDIT_GIANT_JSON_BYTES ?? 2 * 1024 * 1024); // 2 MiB
const LARGE_JSON_BYTES = Number(process.env.AUDIT_LARGE_JSON_BYTES ?? 512 * 1024); // 512 KiB

/** @param {string} name @param {boolean} ok @param {string} [hint] */
function warn(name, ok, hint = "") {
  const line = ok ? `ok   ${name}` : `WARN ${name}${hint ? ` — ${hint}` : ""}`;
  console.log(line);
  if (!ok && strict) process.exitCode = 1;
}

console.log("[audit:runtime-payloads] Payload / import surface audit\n");

/** @param {string} dir @param {string[]} out */
function walkFiles(dir, out) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith(".")) continue;
    const full = join(dir, name.name);
    if (name.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
}

// --- Large JSON under src/content ---
const contentRoot = join(pkgRoot, "src", "content");
const jsonFiles = [];
walkFiles(contentRoot, jsonFiles);
const largeJson = jsonFiles
  .filter((f) => f.endsWith(".json"))
  .map((f) => ({ f, size: statSync(f).size }))
  .filter((x) => x.size >= LARGE_JSON_BYTES)
  .sort((a, b) => b.size - a.size);

console.log("--- Large JSON under src/content ---");
console.log(`(threshold warn: ${(LARGE_JSON_BYTES / 1024).toFixed(0)} KiB; giant: ${(GIANT_JSON_BYTES / 1024 / 1024).toFixed(1)} MiB)\n`);
let giantCount = 0;
for (const row of largeJson.slice(0, 35)) {
  const rel = relative(pkgRoot, row.f);
  const giant = row.size >= GIANT_JSON_BYTES;
  if (giant) giantCount++;
  console.log(`  ${(row.size / 1024).toFixed(0)} KiB${giant ? " GIANT" : ""}  ${rel}`);
}
if (largeJson.length === 0) console.log("  (none above threshold)");
if (giantCount > 0) {
  console.log(
    `  note: ${giantCount} file(s) >= ${(GIANT_JSON_BYTES / 1024 / 1024).toFixed(1)} MiB (catalog shards — must stay server-only / lazy-loaded; see reports/runtime-payload-audit.md)`,
  );
}

// --- generated-indexes ---
const idxDir = join(pkgRoot, "src", "content", "pathway-lessons", "generated-indexes");
let idxBytes = 0;
let idxFiles = 0;
if (existsSync(idxDir)) {
  const files = [];
  walkFiles(idxDir, files);
  for (const f of files) {
    idxBytes += statSync(f).size;
    idxFiles++;
  }
}
console.log(`\n--- generated-indexes ---\n  files: ${idxFiles}  total: ${(idxBytes / 1024 / 1024).toFixed(2)} MiB`);

// --- App route imports: generated-indexes should not appear in src/app ---
const appRoot = join(pkgRoot, "src", "app");
const appFiles = [];
walkFiles(appRoot, appFiles);
const appTsx = appFiles.filter((f) => /\.(tsx|ts|jsx|js)$/.test(f));
const leaked = [];
const clientHeavy = [];
const catalogSyncInClient = [];

for (const f of appTsx) {
  let txt;
  try {
    txt = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  if (txt.includes("generated-indexes")) {
    leaked.push(relative(pkgRoot, f));
  }
  const isClient = /^["']use client["']/m.test(txt.slice(0, 4000));
  if (
    isClient &&
    (txt.includes("pathway-lesson-catalog-sync") || txt.includes("pathwayLessonCatalogSync"))
  ) {
    catalogSyncInClient.push(relative(pkgRoot, f));
  }
  if (isClient && /from\s+["']@\/content\//.test(txt)) {
    clientHeavy.push(relative(pkgRoot, f));
  }
}

console.log("\n--- src/app imports (isolation) ---");
warn("no generated-indexes path in src/app", leaked.length === 0, leaked.slice(0, 8).join(", "));
if (leaked.length) console.log("  hits:", leaked.join("\n       "));

warn("pathway-lesson-catalog-sync not in use client routes", catalogSyncInClient.length === 0, catalogSyncInClient.join(", "));

warn(
  "use client files avoid @/content/* direct imports",
  clientHeavy.length === 0,
  clientHeavy.slice(0, 10).join(", "),
);
if (clientHeavy.length) console.log("  client + @/content:", clientHeavy.join("\n       "));

console.log("\n--- Existing runtime guards (reference) ---");
console.log("  LARGE_API_RESPONSE_BYTES=500000 — logLargeApiResponse / jsonResponseGuarded");
console.log("  ALERT_API_PAYLOAD_BYTES=250000 — logApiPayloadAlert");
console.log("  See src/lib/observability/api-response-size-constants.ts\n");

console.log("See ../reports/runtime-payload-audit.md and ../reports/largest-bundle-surfaces.md (repo root).");
console.log("Phase 6 scaling notes: ../reports/phase-6-infrastructure-scaling.md\n");

if (/^(1|true|yes)$/i.test(String(process.env.BUILD_LOG_MEMORY_USAGE ?? "").trim())) {
  const m = process.memoryUsage();
  console.log("--- process.memoryUsage() (BUILD_LOG_MEMORY_USAGE=1, warn-only) ---");
  console.log(
    JSON.stringify({
      rss: m.rss,
      heapTotal: m.heapTotal,
      heapUsed: m.heapUsed,
      external: m.external,
      arrayBuffers: m.arrayBuffers ?? 0,
    }),
  );
  console.log("");
}

if (process.exitCode) process.exit(process.exitCode);
