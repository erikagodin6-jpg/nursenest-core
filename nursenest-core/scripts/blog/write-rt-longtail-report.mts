#!/usr/bin/env npx tsx
/**
 * Writes reports/rt-longtail-batch-300-README.md and part files for the RT long-tail batch.
 * Run from nursenest-core/: npx tsx scripts/blog/write-rt-longtail-report.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { countWordsInHtmlBody } from "./rt-longtail/body-builder";
import { getRtLongtailTopicManifest } from "./rt-longtail/manifest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..", "..");
const LONGTAIL = join(APP_ROOT, "src", "content", "blog-static-longtail");
const REPORTS = join(APP_ROOT, "reports");

function parseBody(raw: string): string {
  const t = raw.replace(/^\uFEFF/, "");
  if (!t.startsWith("---")) return t;
  const nl = t.indexOf("\n");
  const rest = t.slice(nl + 1);
  const end = rest.indexOf("\n---");
  if (end < 0) return t;
  return rest.slice(end + 4).replace(/^\s*\n/, "");
}

function main(): void {
  const manifest = getRtLongtailTopicManifest();
  const rows: string[] = [];
  let pass = 0;
  let fail = 0;
  for (const topic of manifest) {
    const fp = join(LONGTAIL, `${topic.slug}.md`);
    const raw = readFileSync(fp, "utf8");
    const w = countWordsInHtmlBody(parseBody(raw));
    const ok = w >= 1200 && w <= 1800;
    if (ok) pass += 1;
    else fail += 1;
    const links = (raw.match(/href="\/blog\/[^"]+"/g) ?? []).slice(0, 6).join("; ");
    rows.push(`| ${topic.slug} | ${w} | ${ok ? "pass" : "FAIL"} | ${links || "—"} |`);
  }

  mkdirSync(REPORTS, { recursive: true });

  const header = "| slug | words | 1200–1800 | internal /blog links (sample) |\n| --- | ---: | :--- | --- |\n";
  const chunk = 100;
  const parts: string[] = [];
  for (let i = 0; i < rows.length; i += chunk) {
    const part = Math.floor(i / chunk) + 1;
    const name = `rt-longtail-batch-300-part-${String(part).padStart(2, "0")}.md`;
    parts.push(name);
    writeFileSync(join(REPORTS, name), `# RT long-tail batch — part ${part} of ${Math.ceil(rows.length / chunk)}\n\n${header}${rows.slice(i, i + chunk).join("\n")}\n`, "utf8");
  }

  const readme = `# RT long-tail batch (300 posts) — report index

Generated: ${new Date().toISOString().slice(0, 10)}

## Aggregate

| Metric | Value |
| --- | ---: |
| Posts (manifest) | ${manifest.length} |
| Word band pass (1200–1800 body words) | ${pass} |
| Word band fail | ${fail} |
| Slug prefix | rt- |

## Part files

${parts.map((p) => `- [${p}](./${p})`).join("\n")}

## Validation (run from nursenest-core/)

- npm run validate:blog-static-longtail — required
- npm run diagnose:blog-slug-collisions -- --write-report
- npm run typecheck:critical
- npm run test:blog-recovery
- npm run test:homepage

## Generator

- npx tsx scripts/blog/generate-rt-longtail-files.mts --dry-run — word count audit
- npx tsx scripts/blog/generate-rt-longtail-files.mts --force — regenerate all RT files

## Notes

Content is deterministic from scripts/blog/rt-longtail/manifest.ts and body-builder.ts (seeded pools). Internal links include other /blog/rt-* posts and selected nursing long-tail hubs where present.
`;
  writeFileSync(join(REPORTS, "rt-longtail-batch-300-README.md"), readme, "utf8");
  console.log(`Wrote ${parts.length} part files + rt-longtail-batch-300-README.md under reports/`);
}

main();
