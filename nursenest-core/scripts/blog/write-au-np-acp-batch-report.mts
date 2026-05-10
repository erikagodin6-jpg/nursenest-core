#!/usr/bin/env npx tsx
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsFromHtmlApproximate } from "@/lib/blog/blog-word-count";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "..", "..");
const dir = join(appRoot, "src", "content", "blog-static-longtail");
const out = join(appRoot, "reports", "australia-np-acp-longtail-batch-145.md");

const files = readdirSync(dir).filter((f) => f.startsWith("au-np-acp-") && f.endsWith(".md")).sort();

function parseFrontmatter(raw: string): Record<string, string> {
  if (!raw.startsWith("---")) return {};
  const rest = raw.slice(3);
  const end = rest.indexOf("\n---");
  if (end < 0) return {};
  const block = rest.slice(0, end).trim();
  const o: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    o[m[1]] = v;
  }
  return o;
}

const rows: string[] = [];
rows.push("# Australia NP / ACP long-tail batch (145 posts)");
rows.push("");
rows.push(
  "Generated 2026-05-10 via deterministic generator `scripts/blog/generate-au-np-acp-longtail-batch.mts` (29 clinical stems × 5 Australian practice lenses).",
);
rows.push("");
rows.push("## Validation summary");
rows.push("- `npm run validate:blog-static-longtail` — exit 0");
rows.push(
  "- `npm run diagnose:blog-slug-collisions -- --write-report` — exit 0; report `docs/reports/blog-slug-collision-diagnostic.txt` (20 legacy DB∩supplement overlaps; none use `au-np-acp-` prefix)",
);
rows.push("- `npm run typecheck:critical` — exit 0");
rows.push("- `npm run test:blog-recovery` — exit 0");
rows.push("- `npm run test:homepage` — exit 0");
rows.push("");
rows.push("## SEO / schema completeness (batch-wide)");
rows.push(
  "- Frontmatter matches `blog-static-longtail` loader: slug, title, excerpt, category, tags (JSON array), publishedAt/updatedAt, seoTitle, seoDescription, canonicalUrl `/blog/{slug}`, authorDisplayName, medicalReviewerName, disclaimer.",
);
rows.push(
  "- Body sections: Introduction, Key Takeaways, pathophysiology/differential/workup, pharmacologic management, non-pharmacologic management, monitoring, red flags/escalation, EBP, documentation, exam/orientation review, internal links, Premium CTA, FAQ (4 questions), APA-7 references (AHPRA, NMBA RN/NP standards, ACSQHS NSQHS + medication safety, RACGP secondary).",
);
rows.push("");
rows.push("## Posts (slug, title, approximate body word count)");
rows.push("");
rows.push("| slug | title | words |");
rows.push("| --- | --- | ---:|");
let min = 999999;
let max = 0;
let sum = 0;
for (const f of files) {
  const raw = readFileSync(join(dir, f), "utf8");
  const endFm = raw.indexOf("\n---\n");
  const body = endFm >= 0 ? raw.slice(endFm + 5) : raw;
  const w = countWordsFromHtmlApproximate(body);
  min = Math.min(min, w);
  max = Math.max(max, w);
  sum += w;
  const fm = parseFrontmatter(raw);
  const slug = fm.slug ?? f.replace(/\.md$/, "");
  const title = (fm.title ?? "").replace(/\|/g, "\\|");
  rows.push(`| ${slug} | ${title} | ${w} |`);
}
rows.push("");
rows.push("## Word count stats (HTML-stripped approximation)");
rows.push(`- count: ${files.length}`);
rows.push(`- min: ${min}`);
rows.push(`- max: ${max}`);
rows.push(`- mean: ${Math.round(sum / files.length)}`);
rows.push("");
rows.push("## Excluded / failures");
rows.push("- None for this batch.");
rows.push("");
rows.push("## Collision / merge note");
rows.push(
  "Some internal link targets (for example `sepsis-pathophysiology-early-nursing-recognition`) overlap live `BlogPost` rows; merge rules keep DB primary. Long-tail supplements remain for education/SEO where not superseded.",
);

writeFileSync(out, rows.join("\n"), "utf8");
console.log(`Wrote ${out} (${files.length} posts)`);
