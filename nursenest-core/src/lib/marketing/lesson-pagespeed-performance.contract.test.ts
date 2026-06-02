import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function source(path: string) {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("lesson PageSpeed performance contracts", () => {
  it("keeps lesson-readability-hotfix on the marketing redesign barrel", () => {
    const premium = source("src/app/premium-redesign-2026.css");
    assert.match(
      premium,
      /@import "\.\/styles\/marketing\/lesson-readability-hotfix\.css";/,
      "v2 layout CSS must ship via premium-redesign (CLS fix)",
    );
  });

  it("preconnects to the marketing image CDN from root layout", () => {
    const layout = source("src/app/layout.tsx");
    assert.match(layout, /rel="preconnect"/);
    assert.match(layout, /nursenest-images\.tor1\.cdn\.digitaloceanspaces\.com/);
  });

  it("does not load the 1.3MB hotpink PNG in header lockup", () => {
    const header = source("src/components/brand/header-brand-lockup.tsx");
    assert.equal(header.includes("hotpinkblossomleaflogo.png"), false);
    assert.match(header, /OptimizedBlossomLeafImage/);
  });

  it("uses compositor-friendly transform for v2 lesson progress fill", () => {
    const strip = source("src/components/lessons/lesson-reading-progress-strip.tsx");
    assert.match(strip, /scaleX\(/);
    assert.equal(strip.includes('style={{ width:'), false);
  });

  it("lazy-loads assessment shell on marketing lesson detail", () => {
    const body = source(
      "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
    );
    assert.match(body, /PathwayLessonAssessmentExperienceLazy/);
    assert.equal(body.includes("pathway-lesson-assessment-experience-lazy"), true);
  });

  it("targets modern evergreen browsers to avoid legacy polyfills", () => {
    const pkg = JSON.parse(source("package.json")) as { browserslist?: string[] };
    assert.ok(Array.isArray(pkg.browserslist) && pkg.browserslist.length > 0);
    assert.ok(pkg.browserslist.some((entry) => /chrome\s*>=\s*11/i.test(entry)));
  });
});
