/**
 * Pre-Nursing i18n overlay integrity guard.
 *
 * Catches drift between:
 *  - canonical question bank (pre-nursing-question-bank.ts) ↔ question overlay JSONs
 *  - canonical module registry (pre-nursing-registry.ts) ↔ module overlay directories
 *
 * Run via: node --test src/lib/i18n/pre-nursing-overlay-integrity.test.ts
 *
 * This test has NO network or DB dependencies — it reads local files only.
 * It MUST stay green; any drift means overlay keys or counts are out of sync with
 * the canonical English bank, which would cause silent grading or content issues.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// ── Helpers ───────────────────────────────────────────────────────────────────

function resolveOverlayRoot(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "public", "i18n", "educational-overlays"),
    path.join(cwd, "nursenest-core", "public", "i18n", "educational-overlays"),
  ];
  return candidates.find(existsSync) ?? candidates[0];
}

function loadJson<T>(fp: string): T {
  return JSON.parse(readFileSync(fp, "utf8")) as T;
}

/** Extract canonical question IDs from the TypeScript source using a regex.
 *  Format: q("id", ...) — matches the factory call pattern in pre-nursing-question-bank.ts */
function loadCanonicalQuestionIds(): string[] {
  const candidates = [
    path.join(process.cwd(), "src", "lib", "pre-nursing", "pre-nursing-question-bank.ts"),
    path.join(process.cwd(), "nursenest-core", "src", "lib", "pre-nursing", "pre-nursing-question-bank.ts"),
  ];
  const fp = candidates.find(existsSync);
  assert.ok(fp, "Cannot find pre-nursing-question-bank.ts");
  const src = readFileSync(fp!, "utf8");
  return [...src.matchAll(/q\("([^"]+)"/g)].map((m) => m[1]);
}

/** Extract canonical module slugs from the registry source. */
function loadCanonicalModuleSlugs(): string[] {
  const candidates = [
    path.join(process.cwd(), "src", "content", "pre-nursing", "pre-nursing-registry.ts"),
    path.join(process.cwd(), "nursenest-core", "src", "content", "pre-nursing", "pre-nursing-registry.ts"),
  ];
  const fp = candidates.find(existsSync);
  assert.ok(fp, "Cannot find pre-nursing-registry.ts");
  const src = readFileSync(fp!, "utf8");
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PRIORITY_LOCALES = ["fr", "es"] as const;
const PRIORITY_OVERLAY_SLUGS = [
  "anatomy-physiology",
  "chemistry",
  "fluids-electrolytes",
  "health-assessment",
  "infection-control",
  "medical-terminology",
  "nutrition-foundations",
  "oxygenation",
  "pathophysiology",
  "pharmacology",
] as const;

const REQUIRED_MODULE_FIELDS = [
  "overview",
  "key_concepts",
  "nursing_responsibilities",
  "clinical_pearls",
  "patient_education",
  "key_takeaways",
] as const;

const OVERLAY_ROOT = resolveOverlayRoot();

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("pre-nursing question overlay integrity", () => {
  const canonicalIds = loadCanonicalQuestionIds();

  it("canonical question bank has exactly 80 questions", () => {
    assert.equal(canonicalIds.length, 80, `Expected 80 canonical question IDs, got ${canonicalIds.length}`);
  });

  it("canonical IDs are all unique", () => {
    const unique = new Set(canonicalIds);
    assert.equal(unique.size, canonicalIds.length, "Duplicate question IDs found in canonical bank");
  });

  for (const locale of PRIORITY_LOCALES) {
    const overlayPath = path.join(OVERLAY_ROOT, locale, "pre-nursing-questions.json");

    it(`${locale}: question overlay file exists`, () => {
      assert.ok(existsSync(overlayPath), `Missing: ${overlayPath}`);
    });

    it(`${locale}: question overlay has exactly 80 entries`, () => {
      const overlay = loadJson<Record<string, unknown>>(overlayPath);
      const keys = Object.keys(overlay);
      assert.equal(
        keys.length,
        canonicalIds.length,
        `${locale} overlay has ${keys.length} entries; canonical bank has ${canonicalIds.length}`,
      );
    });

    it(`${locale}: every canonical question ID is present in the overlay`, () => {
      const overlay = loadJson<Record<string, unknown>>(overlayPath);
      const missing = canonicalIds.filter((id) => !(id in overlay));
      assert.deepEqual(missing, [], `${locale} overlay missing IDs: ${missing.join(", ")}`);
    });

    it(`${locale}: overlay contains no extra IDs beyond canonical bank`, () => {
      const overlay = loadJson<Record<string, unknown>>(overlayPath);
      const extra = Object.keys(overlay).filter((k) => !canonicalIds.includes(k));
      assert.deepEqual(extra, [], `${locale} overlay has extra IDs not in canonical bank: ${extra.join(", ")}`);
    });

    it(`${locale}: every overlay entry has stem, options (4), and rationale`, () => {
      type Entry = { stem?: string; options?: unknown[]; rationale?: string };
      const overlay = loadJson<Record<string, Entry>>(overlayPath);
      const errors: string[] = [];
      for (const [id, entry] of Object.entries(overlay)) {
        if (!entry.stem) errors.push(`${id}: missing stem`);
        if (!Array.isArray(entry.options) || entry.options.length !== 4)
          errors.push(`${id}: options must be array of 4 (got ${JSON.stringify(entry.options)?.length ?? "missing"})`);
        if (!entry.rationale) errors.push(`${id}: missing rationale`);
      }
      assert.deepEqual(errors, [], `${locale} question overlay field errors:\n${errors.join("\n")}`);
    });
  }
});

describe("pre-nursing module overlay integrity", () => {
  const canonicalSlugs = loadCanonicalModuleSlugs();

  it("canonical registry has 27 module slugs", () => {
    assert.equal(canonicalSlugs.length, 27, `Expected 27 module slugs, got ${canonicalSlugs.length}`);
  });

  for (const locale of PRIORITY_LOCALES) {
    const moduleDir = path.join(OVERLAY_ROOT, locale, "pre-nursing-modules");

    it(`${locale}: pre-nursing-modules directory exists`, () => {
      assert.ok(existsSync(moduleDir), `Missing overlay directory: ${moduleDir}`);
    });

    it(`${locale}: exactly 10 priority module overlays are present`, () => {
      const present = readdirSync(moduleDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""));
      assert.equal(
        present.length,
        PRIORITY_OVERLAY_SLUGS.length,
        `${locale} has ${present.length} module overlays; expected ${PRIORITY_OVERLAY_SLUGS.length}`,
      );
    });

    it(`${locale}: all 10 priority slug overlays are present`, () => {
      const present = new Set(
        readdirSync(moduleDir)
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, "")),
      );
      const missing = PRIORITY_OVERLAY_SLUGS.filter((s) => !present.has(s));
      assert.deepEqual(missing, [], `${locale} missing priority overlay files: ${missing.join(", ")}`);
    });

    it(`${locale}: no extra overlay files beyond expected priority slugs`, () => {
      const present = readdirSync(moduleDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => f.replace(/\.json$/, ""));
      const extra = present.filter((s) => !(PRIORITY_OVERLAY_SLUGS as readonly string[]).includes(s));
      assert.deepEqual(extra, [], `${locale} has unexpected overlay files: ${extra.join(", ")}`);
    });

    for (const slug of PRIORITY_OVERLAY_SLUGS) {
      it(`${locale}/${slug}: all required fields present and non-empty`, () => {
        const fp = path.join(moduleDir, `${slug}.json`);
        assert.ok(existsSync(fp), `Missing: ${fp}`);
        type Overlay = Record<string, unknown>;
        const data = loadJson<Overlay>(fp);
        const errors: string[] = [];
        for (const field of REQUIRED_MODULE_FIELDS) {
          const val = data[field];
          if (val === undefined || val === null || val === "") {
            errors.push(`missing or empty: ${field}`);
          } else if (field === "key_concepts" || field === "key_takeaways") {
            if (!Array.isArray(val) || val.length === 0) {
              errors.push(`${field} must be a non-empty array`);
            }
          } else if (typeof val !== "string") {
            errors.push(`${field} must be a string`);
          }
        }
        assert.deepEqual(errors, [], `${locale}/${slug} overlay errors:\n${errors.join("\n")}`);
      });
    }
  }
});

describe("pre-nursing overlay/sitemap contract", () => {
  it("every slug in priority overlay list is a valid registry slug", () => {
    const canonicalSlugs = new Set(loadCanonicalModuleSlugs());
    const invalid = PRIORITY_OVERLAY_SLUGS.filter((s) => !canonicalSlugs.has(s));
    assert.deepEqual(invalid, [], `Priority overlay slugs not in registry: ${invalid.join(", ")}`);
  });

  it("no priority overlay slug would cause a 404 in the locale route", () => {
    // For indexable locales (fr, es), the route guards: notFound() if overlay is absent.
    // This test ensures every sitemap-emitted locale lesson URL has a backing overlay.
    for (const locale of PRIORITY_LOCALES) {
      const moduleDir = path.join(OVERLAY_ROOT, locale, "pre-nursing-modules");
      if (!existsSync(moduleDir)) continue;
      const present = new Set(
        readdirSync(moduleDir)
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, "")),
      );
      for (const slug of PRIORITY_OVERLAY_SLUGS) {
        assert.ok(
          present.has(slug),
          `${locale}/pre-nursing/lessons/${slug} would 404: overlay file missing`,
        );
      }
    }
  });
});
