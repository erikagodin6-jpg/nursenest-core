/**
 * Behavioral baseline guards: legacy SPA / marketing URL contracts vs Core learner surfaces.
 * Source-of-truth for legacy routing: `client/src/App.tsx` (wouter), allied under `client/src/allied/*`.
 * Core mapping: `src/lib/legacy-marketing-routes.ts`; learner IA: `src/lib/learner/learner-account-nav-groups.ts` (+ `learner-account-nav.tsx`).
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { mapLegacyMarketingHref, resolveMarketingHref } from "@/lib/legacy-marketing-routes";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");

function assertPageExists(relFromSrc: string) {
  const abs = join(appRoot, relFromSrc);
  assert.ok(existsSync(abs), `expected route module at ${relFromSrc}`);
}

describe("legacy marketing href map — learner-adjacent paths stay on Core or explicit external", () => {
  it("keeps pre-nursing and nested pre-nursing on Core", () => {
    assert.equal(mapLegacyMarketingHref("/pre-nursing"), "/pre-nursing");
    assert.equal(resolveMarketingHref("/pre-nursing/lessons/foo"), "/pre-nursing/lessons/foo");
  });

  it("maps public lesson entry points to Core lessons (not external)", () => {
    assert.equal(mapLegacyMarketingHref("/lessons"), "/lessons");
    assert.equal(mapLegacyMarketingHref("/exam-lessons"), "/lessons");
    assert.equal(mapLegacyMarketingHref("/study"), "/lessons");
  });

  it("maps study-plan to learner app", () => {
    assert.equal(mapLegacyMarketingHref("/study-plan"), "/app/study-plan");
  });

  it("keeps allied health vertical on Core", () => {
    assert.equal(resolveMarketingHref("/allied-health"), "/allied-health");
    assert.equal(resolveMarketingHref("/allied-health/paramedic/lessons"), "/allied-health/paramedic/lessons");
  });
});

describe("Core route modules exist (guards dead lesson/profile/marketing entry)", () => {
  it("learner lessons + detail", () => {
    assertPageExists("app/(student)/app/(learner)/lessons/page.tsx");
    assertPageExists("app/(student)/app/(learner)/lessons/[id]/page.tsx");
  });

  it("learner profile redirect + account hub", () => {
    assertPageExists("app/(student)/app/(learner)/profile/page.tsx");
    assertPageExists("app/(student)/app/(learner)/account/page.tsx");
    assertPageExists("app/(student)/app/(learner)/account/overview/page.tsx");
    assertPageExists("app/(student)/app/(learner)/account/layout.tsx");
    const accountIdx = join(appRoot, "app", "(student)", "app", "(learner)", "account", "page.tsx");
    const hubSrc = readFileSync(accountIdx, "utf8");
    assert.match(hubSrc, /LearnerAccountHub/, "account landing should render LearnerAccountHub");
    const profileIdx = join(appRoot, "app", "(student)", "app", "(learner)", "profile", "page.tsx");
    assert.match(readFileSync(profileIdx, "utf8"), /redirect\("\/app\/account"\)/, "profile short URL should land on account hub");
  });

  it("pre-nursing marketing surfaces", () => {
    assertPageExists("app/(marketing)/(default)/pre-nursing/page.tsx");
    assertPageExists("app/(marketing)/(default)/pre-nursing/lessons/page.tsx");
    assertPageExists("app/(marketing)/(default)/pre-nursing/lessons/[slug]/page.tsx");
  });

  it("allied health marketing shell", () => {
    assertPageExists("app/(marketing)/(default)/allied-health/page.tsx");
    assertPageExists("app/(marketing)/(default)/allied-health/[slug]/page.tsx");
    assertPageExists("app/(marketing)/(default)/allied-health/[slug]/lessons/[lessonSlug]/page.tsx");
  });
});

describe("learner account nav — practical link set (parity with legacy /profile capabilities)", () => {
  it("declares expected hrefs in learner account nav groups", () => {
    const navSrc = join(appRoot, "lib", "learner", "learner-account-nav-groups.ts");
    const src = readFileSync(navSrc, "utf8");
    const expected = [
      "/app",
      "/app/command-center",
      "/app/account",
      "/app/account/overview",
      "/app/account/report-card",
      "/app/account/readiness",
      "/app/account/progress",
      "/app/account/question-bank-performance",
      "/app/account/focus-areas",
      "/app/account/study-history",
      "/app/account/cat-history",
      "/app/review",
      "/app/account/review-queue",
      "/app/account/mistakes",
      "/app/account/notes",
      "/app/account/billing",
      "/app/account/personal",
      "/app/account/study-preferences",
      "/app/account/security",
    ];
    for (const href of expected) {
      assert.match(src, new RegExp(`href:\\s*"${href.replace(/\//g, "\\/")}"`), `missing nav href ${href}`);
    }
  });
});
