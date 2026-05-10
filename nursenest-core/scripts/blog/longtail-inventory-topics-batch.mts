#!/usr/bin/env npx tsx
/**
 * Emits `topicsText` (one topic title per line) for Admin → Blog → Topic batch scheduler paste.
 * Optionally prints a JSON body matching `/api/admin/blog/batch-schedule/preview` (dry-run in browser).
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/longtail-inventory-topics-batch.mts
 *   npx tsx scripts/blog/longtail-inventory-topics-batch.mts --print-preview-body
 *
 * Admin dry-run sequence (no credentials in this repo):
 * 1. Sign in to staff `/admin`, open `/admin/blog/topic-batch`.
 * 2. Paste stdout into "Topics", set exam/country/template/mode, click **Preview slots**.
 * 3. POST `/api/admin/blog/batch-schedule/preview` uses the same payload shape as **Save batch schedule** (see JSON when `--print-preview-body`).
 */
import { createReadStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..", "..");
const repoRoot = resolve(appRoot, "..");
const csvPath = resolve(repoRoot, "reports", "longtail-patho-pharm-topic-inventory.csv");

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

async function loadTitles(): Promise<string[]> {
  const rl = createInterface({ input: createReadStream(csvPath, "utf8"), crlfDelay: Infinity });
  let header: string[] | null = null;
  const titles: string[] = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    if (!header) {
      header = cells;
      continue;
    }
    const ti = header.indexOf("title");
    titles.push((cells[ti] ?? "").replace(/^"|"$/g, ""));
  }
  return titles;
}

async function main(): Promise<void> {
  const titles = await loadTitles();
  if (titles.length !== 300) {
    console.error(`Expected 300 titles from CSV, got ${titles.length}`);
    process.exit(1);
  }

  const printPreview = process.argv.includes("--print-preview-body");
  const topicsText = titles.join("\n") + "\n";

  if (printPreview) {
    const startAt = new Date(Date.now() + 60_000).toISOString();
    console.log(
      JSON.stringify(
        {
          topicsText,
          cadencePerDay: 1,
          startAt,
          exam: "NCLEX-RN",
          country: "unspecified",
          defaultTemplate: "TOPIC_EXPLAINED",
          publishMode: "DRAFT_ONLY",
          localizationOptions: undefined,
        },
        null,
        2,
      ),
    );
    console.error("\n# Copy `topicsText` only for the admin textarea, or POST full JSON to preview endpoint while signed in.\n");
  } else {
    process.stdout.write(topicsText);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
