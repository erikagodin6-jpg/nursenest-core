/**
 * Static checks for learner study cross-links built from string literals in scoped files.
 *
 * Only validates:
 * - `/app/flashcards…` (hub / topic query links)
 * - `/app/practice-tests…` (hub / topic query links)
 * - literals containing `lessonSlug` (lesson hub deep links)
 *
 * Ignores marketing hubs, `/app/lessons` without `lessonSlug`, and other app routes.
 *
 * Run: npx tsx scripts/validate-internal-links.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const literalRe = /["'](\/app\/(?:flashcards|practice-tests|lessons)\?[^"']+)["']/g;

/** Files touched by the lessons ↔ flashcards ↔ practice-tests internal linking work. */
const SCOPED_FILES = [
  "src/components/lessons/pathway-lesson-actions.tsx",
  "src/components/flashcards/flashcards-hub-client.tsx",
  "src/components/flashcards/flashcard-custom-study-client.tsx",
  "src/components/study/active-study-session.tsx",
  "src/components/student/question-bank-practice-client.tsx",
  "src/components/student/practice-tests-hub-client.tsx",
  "src/app/api/questions/grade/route.ts",
  "src/lib/learner/app-study-internal-links.ts",
  "src/app/(app)/app/(learner)/flashcards/page.tsx",
  "src/app/(app)/app/(learner)/lessons/page.tsx",
  "src/app/(app)/app/(learner)/practice-tests/page.tsx",
];

function shouldValidateLiteral(href: string): boolean {
  if (href.startsWith("/app/flashcards")) return true;
  if (href.startsWith("/app/practice-tests")) return true;
  if (href.includes("lessonSlug")) return true;
  return false;
}

function checkHref(href: string, rel: string, issues: string[]) {
  if (href.startsWith("/app/flashcards") || href.startsWith("/app/practice-tests")) {
    if (!href.includes("pathwayId=")) {
      issues.push(`${rel}: topic/hub link missing pathwayId: ${href.slice(0, 160)}`);
    }
  }
  if (href.includes("lessonSlug") && !href.includes("pathwayId=")) {
    issues.push(`${rel}: lessonSlug link without pathwayId`);
  }
}

function main() {
  const issues: string[] = [];

  for (const rel of SCOPED_FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      issues.push(`${rel}: file missing`);
      continue;
    }
    const text = fs.readFileSync(abs, "utf8");
    const hits: string[] = [];
    for (const m of text.matchAll(literalRe)) {
      const href = m[1];
      if (!shouldValidateLiteral(href)) continue;
      hits.push(href);
      checkHref(href, rel, issues);
    }
    const counts = new Map<string, number>();
    for (const h of hits) counts.set(h, (counts.get(h) ?? 0) + 1);
    for (const [h, n] of counts) {
      if (n > 1) issues.push(`${rel}: duplicate literal href (${n}x) ${h.slice(0, 140)}`);
    }
  }

  if (issues.length) {
    console.error("validate-internal-links: FAILED\n" + issues.join("\n"));
    process.exit(1);
  }
  console.log("validate-internal-links: OK (" + SCOPED_FILES.length + " scoped files)");
}

main();
