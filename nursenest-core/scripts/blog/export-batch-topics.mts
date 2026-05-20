#!/usr/bin/env npx tsx
/**
 * Split a mixed-pathway SEO batch manifest into per-pathway topic lists for
 * `scripts/generate-blog-posts.ts --topics-file=... --pathway=...`.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/export-batch-topics.mts --file=./scripts/blog/pathophys-pharm-seo-batch.example.json
 *   npx tsx scripts/blog/export-batch-topics.mts --file=./scripts/blog/your-batch.json --out-dir=./tmp/blog-batch-split
 *
 * Prints a Part 9–style report stub (JSON) to stdout after the topic groups.
 */
import fs from "node:fs";
import path from "node:path";

type BatchItem = {
  topic: string;
  pathwayId: string;
  tier?: string;
  occupation?: string;
  domains?: string[];
};

type BatchFile = {
  batchId?: string;
  notes?: string;
  items: BatchItem[];
};

function parseArgs(argv: string[]): { file: string; outDir: string | null } {
  let file = "";
  let outDir: string | null = null;
  for (const a of argv.slice(2)) {
    if (a.startsWith("--file=")) file = a.slice("--file=".length);
    else if (a.startsWith("--out-dir=")) outDir = a.slice("--out-dir=".length);
  }
  return { file, outDir };
}

function normTopicKey(t: string): string {
  return t.trim().toLowerCase().replace(/\s+/g, " ");
}

function loadBatch(absFile: string): BatchFile {
  const raw = fs.readFileSync(absFile, "utf8");
  const parsed = JSON.parse(raw) as BatchFile;
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error(`Invalid batch file (expected { items: [...] }): ${absFile}`);
  }
  return parsed;
}

function main(): void {
  const { file, outDir } = parseArgs(process.argv);
  if (!file.trim()) {
    console.error("Usage: npx tsx scripts/blog/export-batch-topics.mts --file=./scripts/blog/your-batch.json [--out-dir=./tmp/split]");
    process.exitCode = 1;
    return;
  }

  const absFile = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
  if (!fs.existsSync(absFile)) {
    console.error(`File not found: ${absFile}`);
    process.exitCode = 1;
    return;
  }

  const batch = loadBatch(absFile);
  const seen = new Map<string, string[]>();
  const dupWithinFile: string[] = [];

  for (const it of batch.items) {
    const k = normTopicKey(it.topic);
    const prev = seen.get(k);
    if (prev) {
      prev.push(it.topic);
      if (!dupWithinFile.includes(k)) dupWithinFile.push(k);
    } else {
      seen.set(k, [it.topic]);
    }
  }

  if (dupWithinFile.length > 0) {
    console.error("[export-batch-topics] WARNING: duplicate topic lines in batch (same normalized key):");
    for (const k of dupWithinFile) {
      console.error(`  - ${seen.get(k)?.join(" | ")}`);
    }
  }

  const byPathway = new Map<string, BatchItem[]>();
  for (const it of batch.items) {
    const pid = (it.pathwayId ?? "").trim();
    if (!pid) {
      console.error(`[export-batch-topics] SKIP item missing pathwayId: ${it.topic.slice(0, 80)}`);
      continue;
    }
    const arr = byPathway.get(pid) ?? [];
    arr.push(it);
    byPathway.set(pid, arr);
  }

  const absOut = outDir ? (path.isAbsolute(outDir) ? outDir : path.resolve(process.cwd(), outDir)) : null;
  if (absOut) {
    fs.mkdirSync(absOut, { recursive: true });
  }

  const written: { pathwayId: string; topicsFile: string; topicCount: number }[] = [];

  for (const [pathwayId, items] of [...byPathway.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const lines = items.map((i) => i.topic.trim()).filter((t) => t.length >= 3);
    const body = `${lines.join("\n")}\n`;

    if (absOut) {
      const topicsFile = path.join(absOut, `${pathwayId}.topics.txt`);
      fs.writeFileSync(topicsFile, body, "utf8");
      written.push({ pathwayId, topicsFile, topicCount: lines.length });
    }

    console.log(`\n# --- pathwayId: ${pathwayId} (${lines.length} topics) ---`);
    const topicsRel = absOut
      ? path.relative(process.cwd(), path.join(absOut, `${pathwayId}.topics.txt`)) || path.join(absOut, `${pathwayId}.topics.txt`)
      : `./tmp/${pathwayId}.topics.txt`;
    if (!absOut) {
      console.log(body.trimEnd());
      console.log(`# Save the ${lines.length} lines above to ${topicsRel} (mkdir -p tmp), or re-run with --out-dir=./tmp/blog-batch-split`);
    }
    console.log(
      `npx tsx scripts/generate-blog-posts.ts --topics-file=${topicsRel} --pathway=${pathwayId} --min-words=1800`,
    );
  }

  const tiers = [...new Set(batch.items.map((i) => i.tier).filter(Boolean))];
  const occupations = [...new Set(batch.items.map((i) => i.occupation).filter(Boolean))];

  const reportStub = {
    batchId: batch.batchId ?? null,
    sourceManifest: absFile,
    pathwayGroups: [...byPathway.entries()].map(([pathwayId, items]) => ({
      pathwayId,
      topicCount: items.length,
      titles: items.map((i) => i.topic),
      tiers: [...new Set(items.map((i) => i.tier).filter(Boolean))],
      occupations: [...new Set(items.map((i) => i.occupation).filter(Boolean))],
      topicsFile: absOut ? path.join(absOut, `${pathwayId}.topics.txt`) : null,
    })),
    tiersCovered: tiers,
    occupationsCovered: occupations,
    languagesGenerated: ["en"],
    slugs: [],
    referencesUsed: [],
    internalLinksAdded: [],
    liveUrls: [],
    failedOrSkippedTopics: dupWithinFile.length ? dupWithinFile.map((k) => ({ reason: "duplicate_topic_in_manifest", key: k })) : [],
    notes:
      "Fill slugs, liveUrls, referencesUsed, internalLinksAdded after generation. Add fr-CA / es via localized blog workflow when applicable.",
  };

  if (written.length) {
    console.log("\n# --- wrote topic files ---");
    for (const w of written) {
      console.log(`${w.pathwayId}\t${w.topicCount}\t${w.topicsFile}`);
    }
  }

  console.log("\n# --- BATCH_REPORT_JSON (Part 9 stub) ---");
  console.log(JSON.stringify(reportStub, null, 2));
}

main();
