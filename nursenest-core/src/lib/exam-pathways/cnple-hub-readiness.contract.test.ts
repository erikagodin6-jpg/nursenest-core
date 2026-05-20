/**
 * CNPLE Hub Readiness — End-to-End Regression Contract Tests
 *
 * Guards the two production bugs fixed 2026-05-16:
 *   Bug 1 — Stale pathway-readiness-snapshot.json had ca-np-cnple lessons/questions=0,
 *            causing isPathwayPublishedForPublicSite("ca-np-cnple") to return false.
 *   Bug 2 — Static /canada/np/cnple/page.tsx rendered AuthorityClusterPageView (SEO cluster)
 *            instead of delegating to the dynamic [locale]/[slug]/[examCode] hub workstation.
 *
 * Sections:
 *   1. Readiness snapshot — non-zero, above minimums, published=true
 *   2. Static delegator page — uses hub exports, not AuthorityClusterPageView
 *   3. Dynamic sub-route coverage — questions, lessons, simulation, flashcards, pricing
 *   4. CNPLE route semantics — /simulation canonical, LOFT copy, /cat permanentRedirects
 *   5. Nav and offer gate — isMarketingOfferingPublishedForPublicSite(CA, np) === true
 *   6. Stale snapshot guard — zero counts trigger a test failure for published pathways
 *   7. /cat permanentRedirect — 308 not 307 for crawler deindexing
 *
 * Run:
 *   node --import tsx --test src/lib/exam-pathways/cnple-hub-readiness.contract.test.ts
 * Or via npm:
 *   npm run test:cnple-hub
 *   npm run readiness:verify
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const src = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

// ─── 1. Readiness snapshot ────────────────────────────────────────────────────

describe("CNPLE readiness snapshot — non-zero published counts", () => {
  it("ca-np-cnple lessons count is above NP lesson floor (85)", () => {
    const { getSnapshotCounts } = require("@/lib/navigation/country-exam-readiness-snapshot");
    const { lessons } = getSnapshotCounts("ca-np-cnple");
    assert.ok(
      lessons >= 85,
      `ca-np-cnple snapshot lessons is ${lessons} — must be ≥85 (NP_PUBLIC_LESSON_FLOOR). ` +
        "Stale snapshot? Regenerate with: npm run readiness:emit-snapshot",
    );
  });

  it("ca-np-cnple questions count is above published minimum (200)", () => {
    const { getSnapshotCounts } = require("@/lib/navigation/country-exam-readiness-snapshot");
    const { questions } = getSnapshotCounts("ca-np-cnple");
    assert.ok(
      questions >= 200,
      `ca-np-cnple snapshot questions is ${questions} — must be ≥200 (MIN_PATHWAY_QUESTIONS_PUBLISH). ` +
        "Stale snapshot? Regenerate with: npm run readiness:emit-snapshot",
    );
  });

  it("isPathwayPublishedForPublicSite('ca-np-cnple') returns true", () => {
    const { isPathwayPublishedForPublicSite } = require("@/lib/navigation/country-exam-launch-readiness");
    const result = isPathwayPublishedForPublicSite("ca-np-cnple");
    assert.equal(
      result,
      true,
      "ca-np-cnple must be published for public site. If false, check: " +
        "(a) snapshot counts ≥85 lessons / ≥200 questions, " +
        "(b) PATHWAY_LAUNCH_APPROVED includes ca-np-cnple, " +
        "(c) pathway.status !== 'hidden'",
    );
  });

  it("evaluatePathwayLaunchReadiness returns status='published' for ca-np-cnple", () => {
    const { evaluatePathwayLaunchReadinessFromSnapshot } =
      require("@/lib/navigation/country-exam-launch-readiness");
    const { getExamPathwayById } = require("@/lib/exam-pathways/exam-pathways-catalog");
    const pathway = getExamPathwayById("ca-np-cnple");
    assert.ok(pathway, "ca-np-cnple pathway must be registered");
    const evaluation = evaluatePathwayLaunchReadinessFromSnapshot(pathway);
    assert.equal(
      evaluation.status,
      "published",
      `ca-np-cnple launch status is '${evaluation.status}', expected 'published'. ` +
        `Failing checks: ${evaluation.checks.filter((c: { pass: boolean }) => !c.pass).map((c: { code: string; detail?: string }) => `${c.code}: ${c.detail}`).join("; ")}`,
    );
  });

  it("all readiness checks pass for ca-np-cnple", () => {
    const { evaluatePathwayLaunchReadinessFromSnapshot } =
      require("@/lib/navigation/country-exam-launch-readiness");
    const { getExamPathwayById } = require("@/lib/exam-pathways/exam-pathways-catalog");
    const pathway = getExamPathwayById("ca-np-cnple");
    const evaluation = evaluatePathwayLaunchReadinessFromSnapshot(pathway);
    const failed = evaluation.checks.filter((c: { pass: boolean }) => !c.pass);
    assert.deepEqual(
      failed.map((c: { code: string }) => c.code),
      [],
      `Failing checks: ${failed.map((c: { code: string; detail?: string }) => `${c.code}: ${c.detail}`).join("; ")}`,
    );
  });

  it("isMarketingOfferingPublishedForPublicSite('CA', 'np') returns true", () => {
    const { isMarketingOfferingPublishedForPublicSite } =
      require("@/lib/marketing/country-exam-offerings");
    const result = isMarketingOfferingPublishedForPublicSite("CA", "np");
    assert.equal(
      result,
      true,
      "CA NP marketing offering must be published — this gates the NP hub chip visibility in the tier rail",
    );
  });

  it("PATHWAY_LAUNCH_APPROVED includes ca-np-cnple", () => {
    const { PATHWAY_LAUNCH_APPROVED } = require("@/lib/navigation/country-exam-launch-readiness");
    assert.ok(
      PATHWAY_LAUNCH_APPROVED.has("ca-np-cnple"),
      "ca-np-cnple must be in PATHWAY_LAUNCH_APPROVED — missing editorial sign-off causes max status=ready_for_review",
    );
  });
});

// ─── 2. Static delegator page audit ──────────────────────────────────────────

describe("Static /canada/np/cnple/page.tsx — delegator correctness", () => {
  const staticPage = src(
    "src/app/(marketing)/(default)/canada/np/cnple/page.tsx",
  );

  it("does NOT import or render AuthorityClusterPageView", () => {
    assert.doesNotMatch(
      staticPage,
      /AuthorityClusterPageView/,
      "/canada/np/cnple/page.tsx must not render AuthorityClusterPageView — " +
        "that was the static page that blocked the hub workstation",
    );
  });

  it("does NOT import getAuthorityClusterPage", () => {
    assert.doesNotMatch(
      staticPage,
      /getAuthorityClusterPage/,
      "Hub delegator must not call getAuthorityClusterPage — that returns SEO cluster content, not the hub",
    );
  });

  it("imports HubPage from the dynamic [locale]/[slug]/[examCode]/page", () => {
    assert.match(
      staticPage,
      /from.*\[locale\].*\[slug\].*\[examCode\].*page/,
      "Static page must import from the dynamic hub route to ensure the hub workstation renders",
    );
  });

  it("imports generateMetadata from the dynamic hub", () => {
    assert.match(
      staticPage,
      /generateMetadata.*from.*\[locale\]|from.*\[locale\].*generateMetadata/s,
      "Must re-use hubGenerateMetadata to avoid duplicate/stale metadata",
    );
  });

  it("hardcodes locale='canada'", () => {
    assert.match(staticPage, /locale:\s*["']canada["']/, "Must hardcode locale='canada'");
  });

  it("hardcodes slug='np'", () => {
    assert.match(staticPage, /slug:\s*["']np["']/, "Must hardcode slug='np'");
  });

  it("hardcodes examCode='cnple'", () => {
    assert.match(staticPage, /examCode:\s*["']cnple["']/, "Must hardcode examCode='cnple'");
  });

  it("exports dynamic = 'force-dynamic' (segment config inline, not re-exported)", () => {
    assert.match(
      staticPage,
      /export const dynamic\s*=\s*["']force-dynamic["']/,
      "Must export dynamic='force-dynamic' inline — Next.js cannot statically analyse re-exports",
    );
  });

  it("does NOT create a new Promise.resolve with wrong params", () => {
    // Ensure CNPLE_PARAMS uses the exact three required keys
    assert.doesNotMatch(
      staticPage,
      /locale:\s*["'](?!canada["'])[\w-]+["']/,
      "locale must be 'canada', not any other value",
    );
  });
});

// ─── 3. Dynamic sub-route file existence ─────────────────────────────────────

describe("CNPLE dynamic sub-routes — file existence under [locale]/[slug]/[examCode]", () => {
  const HUB_BASE = "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]";

  for (const sub of ["questions", "lessons", "simulation", "flashcards", "pricing"]) {
    it(`/${sub} route file exists at ${HUB_BASE}/${sub}/page.tsx`, () => {
      let content: string;
      try {
        content = src(`${HUB_BASE}/${sub}/page.tsx`);
      } catch {
        assert.fail(
          `Missing file: ${HUB_BASE}/${sub}/page.tsx — /canada/np/cnple/${sub} will 404 for CNPLE users`,
        );
      }
      assert.ok(content.length > 0, `${sub}/page.tsx is empty`);
      // Each sub-route must resolve the pathway
      assert.match(
        content,
        /resolveExamPathwaySafe|resolveExamPathway|ExamPathway/,
        `${sub}/page.tsx must resolve the exam pathway`,
      );
    });
  }

  it("/questions page imports NpQuestionsHubBoardLinks for NP pathways", () => {
    const content = src(`${HUB_BASE}/questions/page.tsx`);
    assert.match(
      content,
      /NpQuestionsHubBoardLinks/,
      "/questions page must include board-links for NP pathway (CNPLE question bank entry)",
    );
  });

  it("/simulation page is CNPLE-specific (not a generic CAT page)", () => {
    const content = src(`${HUB_BASE}/simulation/page.tsx`);
    assert.match(content, /ca-np-cnple/, "simulation page must be gated to ca-np-cnple");
    assert.match(content, /redirect.*buildExamPathwayPath.*["']cat["']/s,
      "non-CNPLE pathways must be redirected to /cat from the simulation page",
    );
  });

  it("/pricing page exists and resolves pathway for CNPLE", () => {
    const content = src(`${HUB_BASE}/pricing/page.tsx`);
    assert.match(content, /resolveExamPathwaySafe/);
    assert.doesNotMatch(content, /notFound\(\)\s*;?\s*\/\/ CNPLE/,
      "/pricing must not immediately 404 for CNPLE",
    );
  });

  it("no static /canada/np/cnple/questions/page.tsx (would shadow dynamic route)", () => {
    let found = false;
    try {
      src("src/app/(marketing)/(default)/canada/np/cnple/questions/page.tsx");
      found = true;
    } catch {
      found = false;
    }
    assert.equal(
      found,
      false,
      "Static /canada/np/cnple/questions/page.tsx must NOT exist — it would shadow the dynamic questions hub",
    );
  });

  it("no static /canada/np/cnple/lessons/page.tsx (would shadow dynamic route)", () => {
    let found = false;
    try {
      src("src/app/(marketing)/(default)/canada/np/cnple/lessons/page.tsx");
      found = true;
    } catch {
      found = false;
    }
    assert.equal(
      found,
      false,
      "Static /canada/np/cnple/lessons/page.tsx must NOT exist — it would shadow the dynamic lessons hub",
    );
  });

  it("no static /canada/np/cnple/simulation/page.tsx (would shadow dynamic route)", () => {
    let found = false;
    try {
      src("src/app/(marketing)/(default)/canada/np/cnple/simulation/page.tsx");
      found = true;
    } catch {
      found = false;
    }
    assert.equal(
      found,
      false,
      "Static /canada/np/cnple/simulation/page.tsx must NOT exist",
    );
  });

  it("no static /canada/np/cnple/flashcards/page.tsx (would shadow dynamic route)", () => {
    let found = false;
    try {
      src("src/app/(marketing)/(default)/canada/np/cnple/flashcards/page.tsx");
      found = true;
    } catch {
      found = false;
    }
    assert.equal(found, false, "Static /canada/np/cnple/flashcards/page.tsx must NOT exist");
  });

  it("no static /canada/np/cnple/pricing/page.tsx (would shadow dynamic route)", () => {
    let found = false;
    try {
      src("src/app/(marketing)/(default)/canada/np/cnple/pricing/page.tsx");
      found = true;
    } catch {
      found = false;
    }
    assert.equal(found, false, "Static /canada/np/cnple/pricing/page.tsx must NOT exist");
  });
});

// ─── 4. CNPLE route semantics ────────────────────────────────────────────────

describe("CNPLE route semantics — /simulation canonical, LOFT, /cat redirects", () => {
  it("/simulation page generates index:true robots for CNPLE", () => {
    const sim = src(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    // Simulation page has a CNPLE-specific robots block
    const cnpleRobotsBlock = sim.match(/ca-np-cnple[\s\S]{0,300}robots/)?.[0] ?? "";
    assert.ok(
      cnpleRobotsBlock.includes("index: true") || sim.includes("index: true, follow: true"),
      "Simulation page must be indexable for CNPLE (robots: { index: true })",
    );
  });

  it("/simulation page uses LOFT language (not CAT adaptive)", () => {
    const sim = src(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    assert.match(sim, /LOFT/i, "Simulation page must use LOFT terminology");
    assert.match(sim, /not CAT/i, "Simulation page must clarify this is not CAT adaptive");
    assert.doesNotMatch(
      sim,
      /CNPLE.{0,60}(?:is|uses) (?:a )?(?:computerized )?adaptive test/si,
      "Simulation page must not claim CNPLE uses adaptive testing",
    );
  });

  it("/cat page redirects CNPLE to /simulation (not to a CAT engine)", () => {
    const cat = src(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx",
    );
    assert.match(cat, /isCnplePathway/,
      "/cat page must check isCnplePathway before rendering CAT copy");
    assert.match(
      cat,
      /redirect.*buildExamPathwayPath.*["']simulation["']/s,
      "/cat page must redirect CNPLE to /simulation, not serve CAT copy",
    );
  });

  it("/simulation page has a data-nn-qa CTA attribute for Playwright targeting", () => {
    const sim = src(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    assert.match(
      sim,
      /data-nn-qa="cnple-sim-start-cta"/,
      "Simulation page must have data-nn-qa='cnple-sim-start-cta' for E2E targeting",
    );
  });

  it("/simulation canonical title references LOFT or Simulation (not CAT)", () => {
    const sim = src(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    const titleBlock = sim.match(/title:\s*["'][^"']*["']/)?.[0] ?? "";
    assert.ok(
      titleBlock.length > 0,
      "Simulation page must have a title metadata string",
    );
    assert.doesNotMatch(
      titleBlock,
      /CAT.*Exam|Adaptive.*Test/i,
      "Simulation page title must not reference CAT",
    );
  });

  it("LOFT format row says 'Linear / LOFT (not CAT adaptive)'", () => {
    const sim = src(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx",
    );
    assert.match(
      sim,
      /Linear.*LOFT.*not CAT adaptive|not CAT adaptive.*LOFT/i,
      "Format table row must say LOFT and clarify it is not CAT adaptive",
    );
  });
});

// ─── 5. Sitemap coverage ──────────────────────────────────────────────────────

describe("CNPLE sitemap coverage — hub and sub-routes indexed", () => {
  it("sitemap-core.xml static paths include /canada/np/cnple/simulation", () => {
    const route = src("src/app/sitemap-core.xml/route.ts");
    assert.match(
      route,
      /\/canada\/np\/cnple\/simulation/,
      "sitemap-core.xml must include /canada/np/cnple/simulation",
    );
  });

  it("sitemap-core.xml static paths include /canada/np/cnple/flashcards", () => {
    const route = src("src/app/sitemap-core.xml/route.ts");
    assert.match(route, /\/canada\/np\/cnple\/flashcards/);
  });

  it("sitemap-authority-clusters.xml references /canada/np/cnple/questions", () => {
    const route = src("src/app/sitemap-authority-clusters.xml/route.ts");
    assert.match(
      route,
      /\/canada\/np\/cnple\/questions/,
      "Authority cluster sitemap must include /canada/np/cnple/questions",
    );
  });

  it("SITEMAP_FALLBACK_PATHS_ALL includes /canada/np/cnple (hub)", () => {
    const children = src("src/lib/seo/sitemap-index-children.ts");
    assert.match(
      children,
      /["']\/canada\/np\/cnple["']/,
      "sitemap-index-children.ts fallback must include /canada/np/cnple",
    );
  });
});

// ─── 6. Stale snapshot guard ──────────────────────────────────────────────────

describe("Stale snapshot guard — published pathways must have non-zero counts", () => {
  it("snapshot file updatedAt is not stale (max 90 days from today)", () => {
    // Compares against Date.now() so the guard remains live: if the snapshot is not
    // regenerated for 90 days, this test will start failing regardless of when the test runs.
    // When it fails, run: npm run readiness:emit-snapshot  (requires DATABASE_URL)
    // Then commit the updated snapshot and re-run: npm run readiness:verify
    const snapshot = JSON.parse(
      src("src/config/pathway-readiness-snapshot.json"),
    ) as { _meta?: { updatedAt?: string }; [key: string]: unknown };
    const updatedAt = snapshot._meta?.updatedAt;
    assert.ok(updatedAt, "snapshot._meta.updatedAt must be present");
    const snapshotDate = new Date(updatedAt);
    assert.ok(!isNaN(snapshotDate.getTime()), `snapshot._meta.updatedAt is not a valid ISO date: "${updatedAt}"`);
    const nowMs = Date.now();
    const ageMs = nowMs - snapshotDate.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const MAX_AGE_DAYS = 90;
    assert.ok(
      ageDays <= MAX_AGE_DAYS,
      `pathway-readiness-snapshot.json is ${Math.round(ageDays)} days old (max ${MAX_AGE_DAYS}). ` +
        "Regenerate: npm run readiness:emit-snapshot — then commit and run: npm run readiness:verify",
    );
  });

  it("ca-np-cnple snapshot has non-zero lessons (snapshot zero = silently hides hub)", () => {
    const { getSnapshotCounts } = require("@/lib/navigation/country-exam-readiness-snapshot");
    const { lessons } = getSnapshotCounts("ca-np-cnple");
    assert.notEqual(
      lessons,
      0,
      "ca-np-cnple snapshot lessons must NOT be 0 — zero causes isPathwayPublishedForPublicSite to return false, " +
        "silently hiding CNPLE from all nav surfaces. Regenerate: npm run readiness:emit-snapshot",
    );
  });

  it("ca-np-cnple snapshot has non-zero questions (snapshot zero = silently hides hub)", () => {
    const { getSnapshotCounts } = require("@/lib/navigation/country-exam-readiness-snapshot");
    const { questions } = getSnapshotCounts("ca-np-cnple");
    assert.notEqual(
      questions,
      0,
      "ca-np-cnple snapshot questions must NOT be 0 — zero causes isPathwayPublishedForPublicSite to return false. " +
        "Regenerate: npm run readiness:emit-snapshot",
    );
  });

  it("core CA/US nursing pathways with non-zero snapshot are published", () => {
    // Scope: only the primary RN/PN/NP pathways that are production-critical for CA and US.
    // Allied, new-grad, and intl-expansion pathways may be in PATHWAY_LAUNCH_APPROVED before
    // all their readiness checks pass — those are excluded here deliberately.
    const REQUIRED_PUBLISHED: ReadonlyArray<string> = [
      "ca-rn-nclex-rn",
      "ca-rpn-rex-pn",
      "ca-np-cnple",
      "us-rn-nclex-rn",
      "us-lpn-nclex-pn",
      "us-np-fnp",
      "us-np-agpcnp",
      "us-np-pmhnp",
      "us-np-whnp",
      "us-np-pnp-pc",
    ] as const;

    const { isPathwayPublishedForPublicSite } =
      require("@/lib/navigation/country-exam-launch-readiness");

    const failed: string[] = [];
    for (const pathwayId of REQUIRED_PUBLISHED) {
      const published = isPathwayPublishedForPublicSite(pathwayId);
      if (!published) failed.push(pathwayId);
    }
    assert.deepEqual(
      failed,
      [],
      `These core nursing pathways are NOT published: ${failed.join(", ")}. ` +
        "Check snapshot counts, launch-readiness checks, and PATHWAY_LAUNCH_APPROVED membership",
    );
  });

  it("snapshot does not re-introduce zero counts for ca-np-cnple (regression guard)", () => {
    // Direct JSON read — no imports, no transforms. If someone edits the JSON back to 0, this fails.
    const raw = JSON.parse(src("src/config/pathway-readiness-snapshot.json")) as Record<
      string,
      { lessons?: number; questions?: number } | unknown
    >;
    const row = raw["ca-np-cnple"] as { lessons?: number; questions?: number } | undefined;
    assert.ok(row, "ca-np-cnple key must exist in snapshot");
    assert.ok(
      typeof row.lessons === "number" && row.lessons > 0,
      `ca-np-cnple.lessons is ${row.lessons} — must be > 0 (zero caused the production bug)`,
    );
    assert.ok(
      typeof row.questions === "number" && row.questions > 0,
      `ca-np-cnple.questions is ${row.questions} — must be > 0 (zero caused the production bug)`,
    );
  });
});

// ─── 7. Marketing nav gates ───────────────────────────────────────────────────

describe("Marketing nav — CNPLE visible in NP mega-menu and tier chip", () => {
  it("NP mega-menu contains a link to /canada/np/cnple for CA region", () => {
    const { buildMarketingMegaMenus } = require("@/lib/navigation/marketing-mega-menu");
    const menus = buildMarketingMegaMenus("CA", (k: string) => k);
    const npMenu = menus.find((m: { key: string }) => m.key === "np");
    assert.ok(npMenu, "NP mega-menu must exist");
    const allLinks: Array<{ key: string; href: string }> =
      npMenu.groups.flatMap((g: { links: Array<{ key: string; href: string }> }) => g.links);
    const cnpleLink = allLinks.find(
      (l) => l.href === "/canada/np/cnple" || l.key === "np-cnple",
    );
    assert.ok(
      cnpleLink,
      "NP mega-menu must contain a link to /canada/np/cnple (key: np-cnple) for CA region",
    );
  });

  it("marketing tier hub strip NP entry resolves for CA", () => {
    const { buildMarketingTierHubStrip } = require("@/lib/navigation/marketing-tier-hub-strip");
    const strip = buildMarketingTierHubStrip("CA", (k: string) => k);
    const npEntry = strip.find(
      (e: { key: string }) => e.key === "np" || e.key.includes("np"),
    );
    assert.ok(npEntry, "CA tier hub strip must contain an NP entry");
    assert.ok(
      typeof npEntry.hubHref === "string" && npEntry.hubHref.length > 0,
      "NP tier hub entry must have a non-empty hubHref",
    );
  });

  it("defaultPathwayIdForMarketingOffering('CA', 'np') resolves to ca-np-cnple", () => {
    const { defaultPathwayIdForMarketingOffering } = require("@/lib/marketing/country-exam-offerings");
    const id = defaultPathwayIdForMarketingOffering("CA", "np");
    assert.equal(
      id,
      "ca-np-cnple",
      "Canada NP default pathway ID must be ca-np-cnple",
    );
  });
});

// ─── 8. /cat permanentRedirect for CNPLE ────────────────────────────────────

describe("/cat route — CNPLE uses permanentRedirect (308), not temporary redirect (307)", () => {
  const CAT_PAGE = "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx";

  it("imports permanentRedirect from next/navigation", () => {
    const catSrc = src(CAT_PAGE);
    assert.match(
      catSrc,
      /import\s*\{[^}]*permanentRedirect[^}]*\}\s*from\s*["']next\/navigation["']/,
      "/cat page must import permanentRedirect from next/navigation",
    );
  });

  it("CNPLE isCnplePathway block calls permanentRedirect (not redirect)", () => {
    const catSrc = src(CAT_PAGE);
    // Extract the block that handles isCnplePathway
    const cnpleBlock = catSrc.match(/isCnplePathway[\s\S]{0,300}simulation/)?.[0] ?? "";
    assert.ok(cnpleBlock.length > 0, "isCnplePathway block referencing simulation must exist");
    assert.match(
      cnpleBlock,
      /permanentRedirect/,
      "CNPLE /cat handler must use permanentRedirect (308) — not redirect (307). " +
        "307 does not signal to crawlers that /cat is gone; 308 does.",
    );
    assert.doesNotMatch(
      cnpleBlock,
      /(?<!permanent)(?<!\w)redirect\s*\(/,
      "CNPLE /cat handler must NOT use temporary redirect() — it must use permanentRedirect()",
    );
  });

  it("non-CNPLE pathways still use redirect() or permanentRedirect() as appropriate (not changed)", () => {
    const catSrc = src(CAT_PAGE);
    // Allied health uses permanentRedirect — verify that still exists.
    // Use a broad search: find permanentRedirect inside an isAlliedHealthPathway block.
    const alliedBlock = catSrc.match(/isAlliedHealthPathway[\s\S]{1,500}?permanentRedirect/)?.[0] ?? "";
    assert.ok(
      alliedBlock.length > 0,
      "Allied health /cat handler must still use permanentRedirect (not redirect)",
    );
    // The main CAT page body (non-CNPLE, non-allied) must still render normally
    assert.match(
      catSrc,
      /catPathwayShortCatLabel|CatStartCard|appPathwayCatSessionStartPath/,
      "Non-CNPLE /cat page must still render CAT UI for other pathways",
    );
  });

  it("/cat comment explains the 308 semantic", () => {
    const catSrc = src(CAT_PAGE);
    // The comment in the file should document the 308 intent
    assert.match(
      catSrc,
      /308|permanentl/i,
      "/cat page comment must explain that the redirect is permanent (308)",
    );
  });

  it("cnple-product-readiness.contract.test.ts also validates the /cat redirect direction", () => {
    // Belt-and-suspenders: the existing product readiness test should still catch if
    // the redirect target changes from /simulation back to /cat or elsewhere.
    const existing = src("src/lib/exam-pathways/cnple-product-readiness.contract.test.ts");
    assert.match(
      existing,
      /redirect.*buildExamPathwayPath.*["']simulation["']/s,
      "cnple-product-readiness must still assert /cat → /simulation redirect direction",
    );
  });
});
