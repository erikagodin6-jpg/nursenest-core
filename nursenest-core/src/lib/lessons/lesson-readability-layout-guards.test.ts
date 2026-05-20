import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const learnerLayoutPath = path.join(repoRoot, "src/app/(student)/app/(learner)/layout.tsx");
const marketingIndexPath = path.join(repoRoot, "src/app/styles/marketing/index.css");
const marketingReadabilityCssPath = path.join(repoRoot, "src/app/styles/marketing/lesson-readability-hotfix.css");
const learnerReadabilityCssPath = path.join(repoRoot, "src/app/styles/learner/lesson-readability-hotfix.css");

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
    const source = readFileSync(marketingIndexPath, "utf8");
    const contentSurfacesIndex = source.indexOf('@import "./content-surfaces.css";');
    const readabilityIndex = source.indexOf('@import "./lesson-readability-hotfix.css";');

    assert.ok(existsSync(marketingReadabilityCssPath), "Missing public lesson readability hotfix CSS file.");
    assert.notEqual(contentSurfacesIndex, -1, "Marketing content-surfaces.css import missing.");
    assert.notEqual(readabilityIndex, -1, "Lesson readability hotfix import missing from marketing index.");
    assert.ok(
      readabilityIndex > contentSurfacesIndex,
      "Lesson readability hotfix must load after content-surfaces.css so its reader-width overrides win.",
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
