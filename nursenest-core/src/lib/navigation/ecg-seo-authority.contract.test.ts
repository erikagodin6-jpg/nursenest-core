/**
 * ECG SEO Authority Contract Tests — Regression Guards
 *
 * CI-blocking tests verifying that ECG behaves as a first-class platform pillar.
 * Fails if any of the following regress:
 *   1. nav.ecgMastery i18n resolves to "ECG Interpretation" (not "ECG Mastery")
 *   2. nav label is NOT "ECG Mastery" anywhere in English nav
 *   3. Homepage ECG section heading includes search-intent keywords
 *   4. Homepage ECG primary CTA links to /ecg-interpretation (not general lessons)
 *   5. Homepage ECG advanced CTA links to /advanced-ecg-nursing (public, not /modules/)
 *   6. ecg-interpretation page title is keyword-first
 *   7. advanced-ecg-nursing page title mentions "interpretation" or "critical care"
 *   8. ECG FAQ includes search-intent questions
 *   9. Mega-menu RN/NP ECG links point to public ECG authority pages
 *  10. Advanced ECG teaser never links to /modules/ecg-advanced (auth-gated) in public marketing
 *
 * Run:
 *   node --import tsx --test src/lib/navigation/ecg-seo-authority.contract.test.ts
 */

import assert from "node:assert/strict";
import test, { describe } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildMarketingMegaMenus } from "./marketing-mega-menu";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf-8");

// ─── 1. nav.ecgMastery i18n value ─────────────────────────────────────────────

describe("ECG nav i18n — 'ECG Interpretation' label (Phase 1)", () => {
  test("English nav.json nav.ecgMastery is 'ECG Interpretation' (not 'ECG Mastery')", () => {
    const navJson = JSON.parse(read("public/i18n/en/nav.json")) as Record<string, string>;
    assert.equal(
      navJson["nav.ecgMastery"],
      "ECG Interpretation",
      "nav.ecgMastery must resolve to 'ECG Interpretation' — 'ECG Mastery' misaligns with search intent.\n" +
      "Users search for 'ECG interpretation', 'telemetry interpretation', not 'ECG mastery'.",
    );
  });

  test("English nav.json does NOT contain 'ECG Mastery' as a nav value", () => {
    const navJson = JSON.parse(read("public/i18n/en/nav.json")) as Record<string, string>;
    const mastery = Object.entries(navJson).find(([, v]) => v === "ECG Mastery");
    assert.equal(
      mastery,
      undefined,
      `nav.json must not have 'ECG Mastery' as a value — found at key "${mastery?.[0]}". ` +
      "All ECG nav labels should use 'ECG Interpretation'.",
    );
  });

  test("site-header-server.tsx does NOT use 'ECG Mastery' as a label (ECG moved to mega-menus)", () => {
    const src = read("src/components/layout/site-header-server.tsx");
    assert.doesNotMatch(
      src,
      /"ECG Mastery"/,
      "site-header-server.tsx must not use 'ECG Mastery' as a label — " +
      "ECG specialty links were moved from top-level moreLinks to the RN/NP mega-menu dropdowns " +
      "to prevent desktop nav wrapping. The nav.ecgMastery i18n key is still valid in nav.json.",
    );
    // ECG link was intentionally removed from moreLinks (nav bloat fix).
    // Correctness of the label is enforced by the nav.json test above.
    // ECG discoverability is enforced by ecg-nav-visibility.contract.test.ts (mega-menu tests).
  });
});

// ─── 2. Mega-menu ECG link destinations ───────────────────────────────────────

describe("Mega-menu ECG links — public authority pages only (Phase 1 + Phase 6)", () => {
  const t = (k: string) => k;

  test("RN mega-menu primary ECG link points to /ecg-interpretation (not /advanced-ecg-nursing)", () => {
    const menus = buildMarketingMegaMenus("US", t);
    const rnMenu = menus.find((m) => m.key === "rn")!;
    const ecgLink = rnMenu.groups.flatMap((g) => g.links).find((l) => l.key === "rn-ecg-mastery");
    assert.ok(ecgLink, "rn-ecg-mastery link must exist");
    assert.equal(
      ecgLink!.href,
      "/ecg-interpretation",
      "RN primary ECG mega-menu link must point to /ecg-interpretation (Core ECG hub, always public). " +
      "Advanced ECG is the separate add-on at /advanced-ecg-nursing.",
    );
  });

  test("NP mega-menu ECG Interpretation link points to /ecg-interpretation", () => {
    const menus = buildMarketingMegaMenus("CA", t);
    const npMenu = menus.find((m) => m.key === "np")!;
    const ecgLink = npMenu.groups.flatMap((g) => g.links).find((l) => l.key === "np-ecg-interpretation");
    assert.ok(ecgLink, "np-ecg-interpretation link must exist in NP mega-menu");
    assert.equal(ecgLink!.href, "/ecg-interpretation");
  });

  test("No mega-menu ECG link points to /modules/ (auth-gated routes)", () => {
    for (const region of ["US", "CA"] as const) {
      const menus = buildMarketingMegaMenus(region, t);
      for (const menu of menus) {
        const allLinks = menu.groups.flatMap((g) => g.links);
        const ecgLinks = allLinks.filter(
          (l) => l.key.includes("ecg") || l.key.includes("telemetry"),
        );
        for (const link of ecgLinks) {
          assert.ok(
            !link.href.startsWith("/modules/"),
            `Mega-menu ECG link "${link.key}" href "${link.href}" must not use /modules/ path — ` +
            "marketing mega-menu is shown to unauthenticated users who cannot access /modules/",
          );
        }
      }
    }
  });
});

// ─── 3. Homepage ECG section heading and CTAs ─────────────────────────────────

describe("Homepage PremiumHomepageEcg — search-intent heading and CTAs (Phase 2)", () => {
  const src = read("src/components/marketing/home/premium-homepage-ecg.tsx");

  test("Homepage ECG heading includes 'ECG Interpretation' or 'ECG interpretation'", () => {
    assert.ok(
      src.toLowerCase().includes("ecg interpretation"),
      "PremiumHomepageEcg heading must include 'ECG interpretation' — " +
      "the old heading 'Adaptive ECG Education Built Into NurseNest' has no search-intent keywords",
    );
  });

  test("Homepage ECG heading includes 'arrhythmia' or 'telemetry'", () => {
    assert.ok(
      src.toLowerCase().includes("arrhythmia") || src.toLowerCase().includes("telemetry"),
      "PremiumHomepageEcg must include 'arrhythmia' or 'telemetry' in copy — " +
      "these are the primary search terms nurses use when looking for ECG training",
    );
  });

  test("Homepage ECG primary CTA links to /ecg-interpretation", () => {
    assert.match(
      src,
      /href=["']\/ecg-interpretation["']/,
      "PremiumHomepageEcg primary CTA must link to /ecg-interpretation — " +
      "the old CTA pointed to hrefs.lessons (general lessons, not ECG-specific)",
    );
  });

  test("Homepage ECG practice CTA links to /ecg-practice-questions", () => {
    assert.match(
      src,
      /href=["']\/ecg-practice-questions["']/,
      "PremiumHomepageEcg secondary CTA must link to /ecg-practice-questions — " +
      "high-intent SEO query, standalone authority page",
    );
  });

  test("Homepage ECG advanced CTA links to /advanced-ecg-nursing (not /modules/)", () => {
    assert.match(
      src,
      /href=["']\/advanced-ecg-nursing["']/,
      "PremiumHomepageEcg advanced teaser must link to /advanced-ecg-nursing (public authority page)",
    );
    assert.doesNotMatch(
      src,
      /href=["']\/modules\/ecg-advanced["']/,
      "PremiumHomepageEcg must not link to /modules/ecg-advanced — this is auth-gated and breaks for unauthenticated marketing visitors",
    );
  });

  test("Homepage ECG features mention 'arrhythmia' for search-intent alignment", () => {
    assert.ok(
      src.toLowerCase().includes("arrhythmia"),
      "PremiumHomepageEcg feature list must include 'arrhythmia' — " +
      "core search term nurses use for ECG/rhythm training",
    );
  });
});

// ─── 4. ECG page title and description quality ────────────────────────────────

describe("ECG authority page titles — keyword-first, search-intent aligned (Phase 5)", () => {
  test("ecg-interpretation PAGE_TITLE starts with 'ECG' (keyword-first)", () => {
    const src = read("src/app/(marketing)/(default)/ecg-interpretation/page.tsx");
    const titleMatch = src.match(/PAGE_TITLE\s*=\s*["']([^"']+)["']/);
    assert.ok(titleMatch, "ecg-interpretation must have PAGE_TITLE defined");
    const title = titleMatch![1];
    assert.ok(
      title.startsWith("ECG"),
      `ecg-interpretation PAGE_TITLE "${title}" must start with 'ECG' (keyword-first format improves CTR)`,
    );
    assert.ok(
      title.toLowerCase().includes("interpretation") || title.toLowerCase().includes("telemetry"),
      `ecg-interpretation PAGE_TITLE "${title}" must include 'interpretation' or 'telemetry'`,
    );
  });

  test("advanced-ecg-nursing PAGE_TITLE includes 'interpretation' or 'critical care'", () => {
    const src = read("src/app/(marketing)/(default)/advanced-ecg-nursing/page.tsx");
    const titleMatch = src.match(/PAGE_TITLE\s*=\s*["']([^"']+)["']/);
    assert.ok(titleMatch, "advanced-ecg-nursing must have PAGE_TITLE defined");
    const title = titleMatch![1];
    assert.ok(
      title.toLowerCase().includes("interpretation") || title.toLowerCase().includes("critical care"),
      `advanced-ecg-nursing PAGE_TITLE "${title}" must include 'interpretation' or 'critical care' — ` +
      "the old title 'Cardiac Rhythm Mastery' had no search-intent alignment",
    );
  });

  test("advanced-ecg-nursing PAGE_TITLE does NOT use 'Mastery' as primary differentiator", () => {
    const src = read("src/app/(marketing)/(default)/advanced-ecg-nursing/page.tsx");
    const titleMatch = src.match(/PAGE_TITLE\s*=\s*["']([^"']+)["']/);
    const title = (titleMatch?.[1] ?? "").toLowerCase();
    // "mastery" can appear but must not be the primary clinical differentiator
    if (title.includes("mastery")) {
      assert.ok(
        title.includes("interpretation") || title.includes("critical care") || title.includes("telemetry"),
        `advanced-ecg-nursing PAGE_TITLE with 'mastery' must also include an SEO keyword like ` +
        "'interpretation', 'critical care', or 'telemetry' to align with search intent",
      );
    }
  });

  test("ecg-interpretation PAGE_DESCRIPTION mentions 'arrhythmia' or 'telemetry monitoring'", () => {
    const src = read("src/app/(marketing)/(default)/ecg-interpretation/page.tsx");
    const descMatch = src.match(/PAGE_DESCRIPTION\s*=\s*["'`]([^"'`]+)["'`]/);
    assert.ok(descMatch, "ecg-interpretation must have PAGE_DESCRIPTION defined");
    const desc = descMatch![1].toLowerCase();
    assert.ok(
      desc.includes("arrhythmia") || desc.includes("telemetry monitoring") || desc.includes("rhythm strip"),
      "ecg-interpretation PAGE_DESCRIPTION must mention arrhythmia, telemetry monitoring, or rhythm strip",
    );
  });
});

// ─── 5. ECG FAQ search intent coverage ────────────────────────────────────────

describe("ECG authority pages — FAQ search-intent coverage (Phase 4)", () => {
  test("ecg-interpretation FAQ includes 'interpret ECG' or 'ECG rhythms' question", () => {
    const src = read("src/app/(marketing)/(default)/ecg-interpretation/page.tsx");
    assert.ok(
      src.toLowerCase().includes("interpret ecg") || src.toLowerCase().includes("ecg rhythms"),
      "ecg-interpretation FAQ must include a question about 'how to interpret ECG' or 'ECG rhythms' — " +
      "high-volume search queries that improve FAQ rich snippet eligibility",
    );
  });

  test("ecg-interpretation FAQ includes telemetry interpretation question", () => {
    const src = read("src/app/(marketing)/(default)/ecg-interpretation/page.tsx");
    assert.ok(
      src.toLowerCase().includes("telemetry interpretation") || src.toLowerCase().includes("what is telemetry"),
      "ecg-interpretation FAQ must address 'telemetry interpretation' — common search query from nurses",
    );
  });

  test("ecg-interpretation FAQ includes arrhythmia recognition question", () => {
    const src = read("src/app/(marketing)/(default)/ecg-interpretation/page.tsx");
    assert.ok(
      src.toLowerCase().includes("arrhythmia") && src.toLowerCase().includes("faq"),
      "ecg-interpretation FAQ must include arrhythmia recognition content",
    );
  });
});

// ─── 6. Structural data — JSON-LD present on ECG pages ────────────────────────

describe("ECG authority pages — JSON-LD structured data present (Phase 4)", () => {
  const pagesWithSchema = [
    "src/app/(marketing)/(default)/ecg-interpretation/page.tsx",
    "src/app/(marketing)/(default)/advanced-ecg-nursing/page.tsx",
    "src/app/(marketing)/(default)/telemetry-nursing/page.tsx",
    "src/app/(marketing)/(default)/acls-rhythms/page.tsx",
    "src/app/(marketing)/(default)/pals-rhythms/page.tsx",
    "src/app/(marketing)/(default)/pediatric-ecg/page.tsx",
    "src/app/(marketing)/(default)/ecg-practice-questions/page.tsx",
  ];

  for (const page of pagesWithSchema) {
    const pageName = page.split("/").at(-2) ?? page;
    test(`${pageName} has JSON-LD structured data`, () => {
      const src = read(page);
      assert.match(
        src,
        /application\/ld\+json/,
        `${pageName} must include JSON-LD structured data for rich snippet eligibility`,
      );
      assert.match(
        src,
        /schema\.org/,
        `${pageName} JSON-LD must reference schema.org context`,
      );
    });

    test(`${pageName} has FAQPage schema`, () => {
      const src = read(page);
      assert.match(
        src,
        /FAQPage/,
        `${pageName} must include FAQPage schema for FAQ rich snippet eligibility`,
      );
    });

    test(`${pageName} has robots: { index: true }`, () => {
      const src = read(page);
      assert.match(
        src,
        /index:\s*true/,
        `${pageName} must have robots: { index: true } — ECG authority pages must be crawlable`,
      );
      assert.doesNotMatch(
        src,
        /index:\s*false/,
        `${pageName} must not have robots: { index: false }`,
      );
    });
  }
});

// ─── 7. ECG practice questions page exists ────────────────────────────────────

describe("ECG practice questions — standalone authority page (Phase 3)", () => {
  test("/ecg-practice-questions has its own page.tsx (not just cluster redirect)", () => {
    const { existsSync } = require("node:fs");
    assert.ok(
      existsSync(join(ROOT, "src/app/(marketing)/(default)/ecg-practice-questions/page.tsx")),
      "/ecg-practice-questions must have a standalone page.tsx — " +
      "this is a high-intent query ('ECG practice questions nurses') deserving its own canonical authority page",
    );
  });

  test("/ecg-practice-questions page is indexable", () => {
    const src = read("src/app/(marketing)/(default)/ecg-practice-questions/page.tsx");
    assert.match(src, /index:\s*true/, "/ecg-practice-questions must have robots: { index: true }");
    assert.match(src, /FAQPage/, "/ecg-practice-questions must have FAQPage schema");
  });
});
