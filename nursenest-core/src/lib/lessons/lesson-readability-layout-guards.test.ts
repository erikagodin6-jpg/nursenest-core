import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const learnerLayoutPath = path.join(repoRoot, "src/app/(app)/app/(learner)/layout.tsx");
const marketingIndexPath = path.join(repoRoot, "src/app/styles/marketing/index.css");
const premiumRedesignPath = path.join(repoRoot, "src/app/premium-redesign-2026.css");
const marketingReadabilityCssPath = path.join(repoRoot, "src/app/styles/marketing/lesson-readability-hotfix.css");
const marketingCompactCssPath = path.join(repoRoot, "src/app/styles/marketing/lesson-clinical-compact.css");
const learnerReadabilityCssPath = path.join(repoRoot, "src/app/styles/learner/lesson-readability-hotfix.css");
const learnerPremiumDsPath = path.join(repoRoot, "src/app/learner-premium-ds.css");

describe("lesson readability layout guards", () => {
  it("keeps the learner shell layout intact after stylesheet edits", () => {
    const source = readFileSync(learnerLayoutPath, "utf8");

    assert.match(source, /export default async function LearnerShellLayout/);
    assert.match(source, /<LearnerExamStudyProviders>/);
    assert.match(source, /<LearnerExamChromeGate>/);
    assert.match(source, /<LearnerShellDesktopStudyLinks/);
    assert.match(source, /<LearnerShellMobileBottomNav/);
    assert.match(source, /<PageTransitionShell/);
    assert.match(source, /id="nn-learner-main"/);
    assert.match(source, /<\/SentryLearnerShell>/);

    assert.ok(
      source.length > 20_000,
      "Learner shell layout appears truncated; expected full shell body, not just imports.",
    );
  });

  it("keeps the public lesson readability stylesheet loaded after content surfaces", () => {
    const indexSource = readFileSync(marketingIndexPath, "utf8");
    const premiumSource = readFileSync(premiumRedesignPath, "utf8");
    const contentSurfacesIndex = indexSource.indexOf('@import "./content-surfaces.css";');
    const readabilityIndex = indexSource.indexOf('@import "./lesson-readability-hotfix.css";');
    const compactIndex = indexSource.indexOf('@import "./lesson-clinical-compact.css";');
    const premiumContentSurfacesIndex = premiumSource.indexOf(
      '@import "./styles/marketing/content-surfaces.css";',
    );
    const premiumReadabilityIndex = premiumSource.indexOf(
      '@import "./styles/marketing/lesson-readability-hotfix.css";',
    );
    const premiumCompactIndex = premiumSource.indexOf(
      '@import "./styles/marketing/lesson-clinical-compact.css";',
    );

    assert.ok(existsSync(marketingReadabilityCssPath), "Missing public lesson readability hotfix CSS file.");
    assert.ok(existsSync(marketingCompactCssPath), "Missing lesson-clinical-compact.css file.");
    assert.notEqual(contentSurfacesIndex, -1, "Marketing content-surfaces.css import missing.");
    assert.notEqual(readabilityIndex, -1, "Lesson readability hotfix import missing from marketing index.");
    assert.notEqual(compactIndex, -1, "Lesson clinical compact import missing from marketing index.");
    assert.ok(
      readabilityIndex > contentSurfacesIndex,
      "Lesson readability hotfix must load after content-surfaces.css so its reader-width overrides win.",
    );
    assert.ok(
      compactIndex > readabilityIndex,
      "Lesson clinical compact must load after lesson-readability-hotfix.css.",
    );
    assert.notEqual(
      premiumReadabilityIndex,
      -1,
      "Lesson readability hotfix import missing from premium-redesign-2026.css (marketing lesson detail chain).",
    );
    assert.notEqual(
      premiumCompactIndex,
      -1,
      "Lesson clinical compact import missing from premium-redesign-2026.css.",
    );
    assert.ok(
      premiumReadabilityIndex > premiumContentSurfacesIndex,
      "premium-redesign-2026.css must load lesson-readability-hotfix after content-surfaces.css.",
    );
    assert.ok(
      premiumCompactIndex > premiumReadabilityIndex,
      "premium-redesign-2026.css must load lesson-clinical-compact after lesson-readability-hotfix.",
    );
  });

  it("loads clinical compact lesson CSS on learner premium routes", () => {
    const learnerPremium = readFileSync(learnerPremiumDsPath, "utf8");
    const hotfixIndex = learnerPremium.indexOf(
      '@import "./styles/marketing/lesson-readability-hotfix.css";',
    );
    const compactIndex = learnerPremium.indexOf(
      '@import "./styles/marketing/lesson-clinical-compact.css";',
    );
    assert.notEqual(hotfixIndex, -1, "learner-premium-ds.css must import marketing lesson-readability-hotfix.");
    assert.notEqual(compactIndex, -1, "learner-premium-ds.css must import lesson-clinical-compact.");
    assert.ok(
      compactIndex > hotfixIndex,
      "learner-premium-ds.css must load lesson-clinical-compact after lesson-readability-hotfix.",
    );
  });

  it("keeps lesson reader widths constrained to readable prose length", () => {
    const publicCss = readFileSync(marketingReadabilityCssPath, "utf8");
    const learnerCss = readFileSync(learnerReadabilityCssPath, "utf8");

    assert.match(publicCss, /--nn-lesson-reader-max:\s*78ch/);
    assert.match(publicCss, /\.nn-premium-lesson-article\.nn-lesson-article-grid/);
    assert.match(publicCss, /display:\s*block/);
    assert.match(publicCss, /max-width:\s*var\(--nn-lesson-reader-max\)/);

    assert.match(learnerCss, /--nn-learner-lesson-reader-max:\s*78ch/);
    assert.match(learnerCss, /\.nn-lesson-page--learner-app\.nn-premium-lesson-detail-shell/);
    assert.match(learnerCss, /max-width:\s*var\(--nn-learner-lesson-reader-max\)/);
  });
});
