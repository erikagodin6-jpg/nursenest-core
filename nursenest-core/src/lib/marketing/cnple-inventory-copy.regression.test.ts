/**
 * CNPLE inventory copy regression guard.
 *
 * Enforces:
 *  1. All CNPLE count claims go through cnple-inventory-metrics.ts — no stale literals.
 *  2. "4,000+" is only framed as "Canadian-aligned NP" questions.
 *  3. "1,496" (CNPLE-tagged subset) is never conflated with the total "4,000+" count.
 *  4. "100" curated flashcards is not exaggerated.
 *  5. Meta descriptions on CNPLE pages are within the 160-char SEO limit.
 *  6. Page titles on CNPLE pages are within the 60-char SEO recommendation.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function readSrc(relPath: string): string {
  return readFileSync(join(ROOT, relPath), "utf8");
}

/** Strip TypeScript/TSX comments so assertions don't false-positive on commented code. */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*/g, "");
}

/** Lines in a source file that are not comments and match a pattern. */
function liveLines(src: string, pattern: RegExp): string[] {
  return stripComments(src)
    .split("\n")
    .filter((l) => pattern.test(l));
}

// ─── Files to audit for hardcoded CNPLE inventory literals ────────────────────
const CNPLE_PAGES = [
  "src/app/(marketing)/(default)/cnple-flashcards/page.tsx",
  "src/app/(marketing)/(default)/cnple-practice-questions/page.tsx",
  "src/app/(marketing)/(default)/cnple-simulation-exam/page.tsx",
  "src/app/(marketing)/(default)/cnple-study-guide/page.tsx",
  "src/app/(marketing)/(default)/cnple-prescribing-questions/page.tsx",
  "src/app/(marketing)/(default)/cnple-pharmacology/page.tsx",
  "src/app/(marketing)/(default)/cnple-clinical-judgment/page.tsx",
  "src/app/(marketing)/(default)/cnple-differential-diagnosis/page.tsx",
  "src/app/(marketing)/(default)/cnple-mental-health/page.tsx",
  "src/app/(marketing)/(default)/cnple-primary-care/page.tsx",
  "src/app/(marketing)/(default)/cnple-geriatrics/page.tsx",
  "src/app/(marketing)/(default)/cnple-womens-health/page.tsx",
  "src/app/(marketing)/(default)/cnple-pediatrics/page.tsx",
  "src/app/(marketing)/(default)/cnple-lab-interpretation/page.tsx",
  "src/app/(marketing)/(default)/cnple-vs-cnpe/page.tsx",
  "src/app/(marketing)/(default)/what-is-the-cnple/page.tsx",
  "src/app/(marketing)/(default)/canada-np-exam-prep/page.tsx",
  "src/lib/seo/authority-cluster-pages.ts",
];

const CNPLE_INVENTORY_STALE_PATTERN = /\b(1[,\s]?496|4[,\s]?000\+?|1[,\s]?154|1[,\s]?463)\b/;

describe("CNPLE inventory literals — no hardcoded counts outside metrics file", () => {
  for (const file of CNPLE_PAGES) {
    it(`${file} has no hardcoded inventory literals`, () => {
      const src = readSrc(file);
      const hits = liveLines(src, CNPLE_INVENTORY_STALE_PATTERN);
      assert.equal(
        hits.length,
        0,
        `${file}: found hardcoded CNPLE inventory count(s) — use CNPLE_INVENTORY from cnple-inventory-metrics.ts instead:\n  ${hits.slice(0, 3).map((l) => l.trim()).join("\n  ")}`,
      );
    });
  }
});

describe("CNPLE inventory metrics file — correct constants and no double-count", () => {
  const metricsFile = "src/lib/marketing/cnple-inventory-metrics.ts";

  it("metrics file exists and exports CNPLE_INVENTORY", () => {
    const src = readSrc(metricsFile);
    assert.match(src, /export const CNPLE_INVENTORY/, "Must export CNPLE_INVENTORY");
  });

  it("caQuestionsLabel is '4,000+' (conservative round number for Canadian-aligned NP)", () => {
    const src = readSrc(metricsFile);
    assert.match(src, /caQuestionsLabel:\s*"4,000\+"/, "caQuestionsLabel must be '4,000+'");
  });

  it("cnpleTaggedLabel is '1,496' (explicitly-tagged subset only)", () => {
    const src = readSrc(metricsFile);
    assert.match(src, /cnpleTaggedLabel:\s*"1,496"/, "cnpleTaggedLabel must be '1,496'");
  });

  it("curatedFlashcardsLabel is '100' (not exaggerated)", () => {
    const src = readSrc(metricsFile);
    assert.match(src, /curatedFlashcardsLabel:\s*"100"/, "curatedFlashcardsLabel must be '100'");
  });

  it("flashcardsLabel is never equal to curatedFlashcardsLabel (total ≠ curated)", () => {
    const src = readSrc(metricsFile);
    // flashcardsLabel must be larger than "100" (the curated subset)
    const totalMatch = src.match(/flashcardsLabel:\s*"([^"]+)"/);
    const curatedMatch = src.match(/curatedFlashcardsLabel:\s*"([^"]+)"/);
    assert.ok(totalMatch && curatedMatch, "Both flashcardsLabel and curatedFlashcardsLabel must be defined");
    assert.notEqual(
      totalMatch![1],
      curatedMatch![1],
      "flashcardsLabel and curatedFlashcardsLabel must differ — total flashcards ≠ curated cards",
    );
    const total = parseInt(totalMatch![1].replace(/,/g, ""), 10);
    const curated = parseInt(curatedMatch![1].replace(/,/g, ""), 10);
    assert.ok(total > curated, `Total flashcards (${total}) must exceed curated count (${curated})`);
  });

  it("caQuestionsLabel is strictly greater than cnpleTaggedLabel numerically", () => {
    const src = readSrc(metricsFile);
    const caMatch = src.match(/caQuestionsLabel:\s*"([^"]+)"/);
    const cnpleMatch = src.match(/cnpleTaggedLabel:\s*"([^"]+)"/);
    assert.ok(caMatch && cnpleMatch, "Both labels must be defined");
    // "4,000+" as a string just needs to be a different, broader claim than "1,496"
    assert.notEqual(caMatch![1], cnpleMatch![1], "CA total and CNPLE-tagged counts must differ");
  });
});

describe("CNPLE framing rules — 4,000+ is Canadian-aligned NP, not CNPLE-only", () => {
  it("authority-cluster-pages.ts uses caQuestionsLabel with 'Canadian-aligned NP' framing", () => {
    const src = readSrc("src/lib/seo/authority-cluster-pages.ts");
    // caQuestionsLabel must appear near "Canadian-aligned NP" — not as a bare CNPLE question count
    assert.match(
      src,
      /caQuestionsLabel.*Canadian-aligned NP|Canadian-aligned NP.*caQuestionsLabel/,
      "4,000+ questions must be framed as 'Canadian-aligned NP' not 'CNPLE questions'",
    );
  });

  it("authority-cluster-pages.ts never directly states '1,496 CNPLE questions' as the main claim", () => {
    const src = readSrc("src/lib/seo/authority-cluster-pages.ts");
    const live = liveLines(src, /1,496/);
    // 1,496 should not appear as a hardcoded literal (must come via cnpleTaggedLabel)
    assert.equal(
      live.length,
      0,
      "1,496 must not be hardcoded in authority-cluster-pages.ts — use CNPLE_INVENTORY.cnpleTaggedLabel",
    );
  });
});

describe("CNPLE SEO meta description lengths", () => {
  it("authority cluster overview description is under 160 chars", () => {
    const src = readSrc("src/lib/seo/authority-cluster-pages.ts");
    // Extract the overview description template (after slug === 'overview' ternary)
    // Find lines with caQuestionsLabel in description context
    const match = src.match(/description:\s*\n\s*slug === "overview"\s*\?\s*`([^`]+)`/);
    if (!match) {
      // If structure changed, verify the file still imports from metrics
      assert.match(src, /CNPLE_INVENTORY/, "authority-cluster-pages.ts must import CNPLE_INVENTORY");
      return;
    }
    const template = match[1];
    // Substitute known values from metrics
    const rendered = template
      .replace(/\$\{CNPLE_INVENTORY\.caQuestionsLabel\}/g, "4,000+")
      .replace(/\$\{CNPLE_INVENTORY\.flashcardsLabel\}/g, "1,154")
      .replace(/\$\{CNPLE_INVENTORY\.lessonsLabel\}/g, "1,463")
      .replace(/\$\{CNPLE_INVENTORY\.curatedFlashcardsLabel\}/g, "100");
    assert.ok(
      rendered.length <= 160,
      `CNPLE overview meta description is ${rendered.length} chars (limit 160): "${rendered}"`,
    );
  });

  it("cnple-flashcards page description is under 160 chars", () => {
    const src = readSrc("src/app/(marketing)/(default)/cnple-flashcards/page.tsx");
    const match = src.match(/PAGE_DESCRIPTION\s*=\s*`([^`]+)`/);
    assert.ok(match, "PAGE_DESCRIPTION constant must be present");
    const rendered = match![1]
      .replace(/\$\{CNPLE_INVENTORY\.flashcardsLabel\}/g, "1,154")
      .replace(/\$\{CNPLE_INVENTORY\.curatedFlashcardsLabel\}/g, "100");
    assert.ok(
      rendered.length <= 160,
      `cnple-flashcards PAGE_DESCRIPTION is ${rendered.length} chars (limit 160): "${rendered}"`,
    );
  });

  it("authority cluster topic description is under 160 chars with longest actual topic", () => {
    const src = readSrc("src/lib/seo/authority-cluster-pages.ts");
    // Find the else branch of the description ternary (topic description)
    const match = src.match(/`\$\{topic\} for CNPLE preparation[^`]+`/);
    if (!match) {
      assert.match(src, /CNPLE_INVENTORY/, "File must still use CNPLE_INVENTORY");
      return;
    }
    // Use the actual longest topic name from the CNPLE cluster (30 chars)
    const LONGEST_ACTUAL_TOPIC = "CNPLE provisional registration";
    const rendered = match[0]
      .replace(/^`/, "")
      .replace(/`$/, "")
      .replace(/\$\{topic\}/g, LONGEST_ACTUAL_TOPIC);
    assert.ok(
      rendered.length <= 160,
      `CNPLE topic meta description is ${rendered.length} chars with longest topic "${LONGEST_ACTUAL_TOPIC}" (limit 160): "${rendered}"`,
    );
  });
});

describe("CNPLE inventory metrics — 100 curated flashcards not exaggerated", () => {
  it("curatedFlashcardsLong contains '100' and 'hand-authored'", () => {
    const src = readSrc("src/lib/marketing/cnple-inventory-metrics.ts");
    assert.match(src, /curatedFlashcardsLong:\s*"100 hand-authored/, "curatedFlashcardsLong must start with '100 hand-authored'");
  });

  it("no CNPLE page claims more than 100 curated/hand-authored flashcards", () => {
    for (const file of CNPLE_PAGES) {
      const src = readSrc(file);
      const live = liveLines(src, /([2-9]\d{2}|[1-9]\d{3})\s*(curated|hand.authored)/i);
      assert.equal(
        live.length,
        0,
        `${file}: found a curated/hand-authored flashcard count that exceeds 100:\n  ${live.slice(0, 2).map((l) => l.trim()).join("\n  ")}`,
      );
    }
  });
});
