#!/usr/bin/env npx tsx
/**
 * Renders `reports/longtail-patho-pharm-topic-inventory.md` from the UTF-8 CSV
 * `reports/longtail-patho-pharm-topic-inventory.csv` (300 rows + header).
 *
 * Adds columns required by the long-tail program: related modules, concrete internal
 * link targets (canonical marketing paths), and a numeric priority score.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/longtail-inventory-render-md.mts
 */
import { createWriteStream } from "node:fs";
import { createReadStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..", "..");
const repoRoot = resolve(appRoot, "..");
const csvPath = resolve(repoRoot, "reports", "longtail-patho-pharm-topic-inventory.csv");
const mdPath = resolve(repoRoot, "reports", "longtail-patho-pharm-topic-inventory.md");

type Row = Record<string, string>;

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

function modulesForCluster(cluster: string): string {
  const c = cluster.toLowerCase();
  if (c.includes("pharm")) return "Lessons; Flashcards; Question Bank; Labs";
  if (c.includes("lab") || c.includes("abg") || c.includes("renal") || c.includes("electrolyte"))
    return "Labs engine; Lessons; Question Bank; Flashcards";
  if (c.includes("ecg") || c.includes("cardio") || c.includes("hemodynamic") || c.includes("shock"))
    return "ECG module; Lessons; Question Bank; Dashboard readiness";
  if (c.includes("exam") || c.includes("delegat") || c.includes("priorit"))
    return "CAT; Question Bank; Lessons; Flashcards";
  return "Lessons; Question Bank; Flashcards; Tools";
}

function linksForTier(tier: string): string {
  const t = tier.toUpperCase();
  if (t === "PN") {
    return "`/us/pn/nclex-pn` `/us/pn/nclex-pn/lessons` `/us/pn/nclex-pn/questions` `/question-bank` `/blog` `/canada/pn/rex-pn` (CA cohort)";
  }
  if (t === "NP") {
    return "`/us/np/fnp` `/us/np/fnp/lessons` `/us/np/fnp/questions` `/question-bank` `/blog` `/canada/np/cnple` (CA cohort)";
  }
  return "`/us/rn/nclex-rn` `/us/rn/nclex-rn/lessons` `/us/rn/nclex-rn/questions` `/question-bank` `/flashcards` `/blog` `/app/labs` `/lessons`";
}

function priorityScore(title: string, slug: string): number {
  const hay = `${title} ${slug}`.toLowerCase();
  if (hay.includes("nclex trap") || hay.includes("first intervention") || hay.includes("priority"))
    return 5;
  if (hay.includes("shock") || hay.includes("abg") || hay.includes("ards") || hay.includes("tamponade"))
    return 5;
  if (hay.includes("ecg") || hay.includes("hyperkalem") || hay.includes("overdose") || hay.includes("toxicity"))
    return 4;
  if (hay.includes("delegation") || hay.includes("assignment")) return 4;
  return 3;
}

function escCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

async function main(): Promise<void> {
  const rl = createInterface({ input: createReadStream(csvPath, "utf8"), crlfDelay: Infinity });
  let header: string[] | null = null;
  const rows: Row[] = [];
  let lineNo = 0;
  for await (const line of rl) {
    lineNo++;
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    if (!header) {
      header = cells;
      continue;
    }
    const row: Row = {};
    for (let i = 0; i < header.length; i++) {
      row[header[i]!] = (cells[i] ?? "").replace(/^"|"$/g, "");
    }
    rows.push(row);
  }

  if (rows.length !== 300) {
    console.error(`Expected 300 data rows, got ${rows.length} from ${csvPath}`);
    process.exit(1);
  }

  const slugs = rows.map((r) => r.slug);
  if (new Set(slugs).size !== 300) {
    console.error("Duplicate slugs in CSV");
    process.exit(1);
  }

  const slugRe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const s of slugs) {
    if (!slugRe.test(s)) {
      console.error(`Invalid slug: ${s}`);
      process.exit(1);
    }
  }

  const out = createWriteStream(mdPath, "utf8");
  out.write("# Long-tail pathophysiology & pharmacology topic inventory\n\n");
  out.write("**Program:** NurseNest SEO long-tail blog pipeline (reuse-first admin batch scheduler).\n\n");
  out.write(`**Rows:** ${rows.length} (unique URL-safe slugs).\n\n`);
  out.write("**Source table:** machine-readable `longtail-patho-pharm-topic-inventory.csv` (same directory).\n\n");
  out.write("**Internal links:** concrete marketing paths from `canonical-pathway-hubs`, `marketing-entry-routes`, and `buildLocalizedBlogHref` patterns (`/:locale/:region/:profession/:exam/blog`).\n\n");
  out.write("---\n\n");
  out.write(
    "| title | slug | primary keyword | search intent | tier | country/region | category | related NurseNest modules | internal link targets | priority score |\n",
  );
  out.write(
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n",
  );

  for (const r of rows) {
    const title = r.title ?? "";
    const slug = r.slug ?? "";
    const kw = r.primary_keyword ?? "";
    const intent = r.search_intent ?? "informational";
    const tier = (r.tier ?? "RN").toUpperCase();
    const country = r.country ?? "Global";
    const cat = r.category_cluster ?? "";
    const modules = modulesForCluster(cat);
    const links = linksForTier(tier);
    const score = String(priorityScore(title, slug));
    out.write(
      `| ${escCell(title)} | ${escCell(slug)} | ${escCell(kw)} | ${escCell(intent)} | ${escCell(tier)} | ${escCell(country)} | ${escCell(cat)} | ${escCell(modules)} | ${escCell(links)} | ${score} |\n`,
    );
  }

  await new Promise<void>((res, rej) => {
    out.end(() => res());
    out.on("error", rej);
  });

  console.log(`Wrote ${mdPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
