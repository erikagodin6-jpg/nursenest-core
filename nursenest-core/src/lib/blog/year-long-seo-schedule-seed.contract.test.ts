import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");
const seedPath = join(root, "scripts", "blog", "seed-year-long-seo-blog-schedule-v2.mts");

function seedSource(): string {
  return readFileSync(seedPath, "utf8");
}

describe("year-long NurseNest SEO blog schedule seed", () => {
  it("targets the full 5-posts-per-day year plan", () => {
    const src = seedSource();
    assert.match(src, /Math\.min\(365/);
    assert.match(src, /Math\.min\(1825/);
    assert.match(src, /publishHoursToronto\s*=\s*\[8, 11, 14, 17, 20\]/);
  });

  it("fails fast on generated duplicate slugs instead of silently skipping most of the year", () => {
    const src = seedSource();
    assert.match(src, /const seen = new Set<string>\(\)/);
    assert.match(src, /if \(seen\.has\(payload\.slug\)\) throw new Error/);
    assert.match(src, /seen\.add\(payload\.slug\)/);
  });

  it("uses DB-backed scheduled BlogPost rows, not static files", () => {
    const src = seedSource();
    assert.match(src, /prisma\.blogPost\.create/);
    assert.match(src, /postStatus:\s*BlogPostStatus\.SCHEDULED/);
    assert.match(src, /workflowStatus:\s*BlogWorkflowStatus\.SCHEDULED/);
    assert.match(src, /publishAt,/);
    assert.match(src, /scheduledAt:\s*publishAt/);
  });

  it("keeps NurseNest conversion links embedded in every generated post", () => {
    const src = seedSource();
    for (const required of [
      "/app/lessons",
      "/app/questions",
      "/app/flashcards",
      "/app/practice-tests",
      "/ecg-interpretation",
      "/advanced-ecg-nursing",
      "/canada/pn/rex-pn",
      "/canada/np/cnple/simulation",
      "/allied-health/respiratory",
    ]) {
      assert.ok(src.includes(required), `missing internal link target ${required}`);
    }
  });

  it("covers the major NurseNest tiers and search clusters", () => {
    const src = seedSource();
    for (const required of [
      "NCLEX-RN",
      "REx-PN",
      "CNPLE",
      "Respiratory Therapy",
      "Pre-Nursing",
      "New Grad",
      "ECG interpretation",
      "ABGs",
      "Pediatrics",
      "Pharmacology",
      "Critical care",
    ]) {
      assert.ok(src.includes(required), `missing cluster ${required}`);
    }
  });

  it("requires explicit --apply and DATABASE_URL for writes", () => {
    const src = seedSource();
    assert.match(src, /const apply = rawArgs\.includes\("--apply"\)/);
    assert.match(src, /const dryRun = !apply/);
    assert.match(src, /if \(apply && !process\.env\.DATABASE_URL\?\.trim\(\)\)/);
    assert.match(src, /Refusing writes: DATABASE_URL is not set/);
  });
});
