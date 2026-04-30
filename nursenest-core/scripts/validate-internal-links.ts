/**
 * Static checks for in-app study cross-links: pathwayId on /app/flashcards and /app/practice-tests
 * query variants; /app/lessons? with lessonSlug must include pathwayId.
 *
 * Run: npx tsx scripts/validate-internal-links.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");

const literalRe = /["'](\/app\/(?:flashcards|practice-tests|lessons)\?[^"']+)["']/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walk(p, out);
    } else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function checkHref(href: string, file: string, issues: string[]) {
  if (href.includes("/app/flashcards?") || href.includes("/app/practice-tests?")) {
    if (!href.includes("pathwayId=")) {
      issues.push(`${file}: hub link missing pathwayId: ${href.slice(0, 140)}`);
    }
  }
  if (href.includes("/app/lessons?") && href.includes("lessonSlug=") && !href.includes("pathwayId=")) {
    issues.push(`${file}: lessonSlug link without pathwayId`);
  }
}

function main() {
  const files = walk(SRC);
  const issues: string[] = [];

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const hits: string[] = [];
    for (const m of text.matchAll(literalRe)) {
      const href = m[1];
      if (href.includes("/app/flashcards?") || href.includes("/app/practice-tests?") || href.includes("/app/lessons?")) {
        hits.push(href);
        checkHref(href, path.relative(ROOT, file), issues);
      }
    }
    const counts = new Map<string, number>();
    for (const h of hits) counts.set(h, (counts.get(h) ?? 0) + 1);
    const rel = path.relative(ROOT, file);
    for (const [h, n] of counts) {
      if (n > 1) issues.push(`${rel}: duplicate literal href (${n}x) ${h.slice(0, 120)}`);
    }
  }

  if (issues.length) {
    console.error("validate-internal-links: FAILED\n" + issues.join("\n"));
    process.exit(1);
  }
  console.log("validate-internal-links: OK");
}

main();
