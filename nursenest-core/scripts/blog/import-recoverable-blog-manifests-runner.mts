/**
 * Classifies audit inventory + import-ready manifests for safe BlogPost recovery (dry-run default).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { countWordsFromHtml } from "../../src/lib/blog/blog-word-count";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..", "..", "..");
const inventoryPath = join(repoRoot, "reports", "blog-hidden-content-inventory.json");
const reportPath = join(repoRoot, "reports", "recoverable-blog-import-report.json");
const batchPath = join(repoRoot, "data", "blog-manifest", "batch-01", "batch-01-import-ready.json");

type InventoryFile = {
  summary?: { totalRecords?: number };
  inventory?: Array<{
    slug?: string;
    wordCount?: number | null;
    reasons?: string[];
    publishReadiness?: string;
    sourceType?: string;
  }>;
};

function parseArgs(argv: string[]) {
  let apply = false;
  for (const a of argv) {
    if (a === "--apply") apply = true;
  }
  return { apply };
}

function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  if (apply) {
    throw new Error("Apply disabled in this runner — use Prisma-backed import tooling after explicit approval.");
  }

  if (!existsSync(inventoryPath)) {
    throw new Error(`Missing inventory: ${inventoryPath}`);
  }
  const inv = JSON.parse(readFileSync(inventoryPath, "utf8")) as InventoryFile;
  const total = inv.summary?.totalRecords ?? inv.inventory?.length ?? 0;

  let metadataOnly = 0;
  let hasBodySignal = 0;
  for (const row of inv.inventory ?? []) {
    const wc = typeof row.wordCount === "number" ? row.wordCount : 0;
    const reasons = row.reasons ?? [];
    if (reasons.some((r) => r.includes("missing_full_body") || r.includes("metadata_only"))) metadataOnly += 1;
    if (wc >= 800) hasBodySignal += 1;
  }

  let batchImportable = 0;
  let batchPosts = 0;
  if (existsSync(batchPath)) {
    const batch = JSON.parse(readFileSync(batchPath, "utf8")) as { posts?: Array<{ slug: string; body?: string }> };
    batchPosts = batch.posts?.length ?? 0;
    for (const p of batch.posts ?? []) {
      const wc = countWordsFromHtml(p.body ?? "");
      if (wc >= 800) batchImportable += 1;
    }
  }

  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        apply: false,
        inventoryPath,
        batchPath,
        counts: {
          inventoryTotalApprox: total,
          inventoryRowsWithWordCountGte800: hasBodySignal,
          inventoryMetadataOnlySignals: metadataOnly,
          batchPosts,
          batchFullBodyGte800Words: batchImportable,
        },
        policy: [
          "Only rows with full HTML bodies (≥800 words) are importable as canonical BlogPost drafts.",
          "Metadata-only SEO ideas belong in a generation queue, not public BlogPost.",
          "Duplicates are skipped at import time (slug unique).",
        ],
      },
      null,
      2,
    ),
    "utf8",
  );

  // eslint-disable-next-line no-console
  console.log(`[recoverable-blog-import] wrote ${reportPath}`);
}

main();
