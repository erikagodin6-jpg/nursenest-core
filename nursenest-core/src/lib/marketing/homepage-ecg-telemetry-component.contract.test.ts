/**
 * ECG marketing strip reuses the hero-exported illustration — avoid duplicate competing SVG systems.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "path";
import test from "node:test";

const ROOT = process.cwd();

test("PremiumHomepageEcg imports MarketingHomepageEcgStripIllustration only from premium-homepage-hero", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-homepage-ecg.tsx"), "utf8");
  assert.match(
    src,
    /import\s*\{\s*MarketingHomepageEcgStripIllustration\s*\}\s*from\s*"(?:\.\/premium-homepage-hero|@\/components\/marketing\/home\/premium-homepage-hero)"/,
  );
  assert.doesNotMatch(src, /\/modules\/ecg/);
});

test("No second inline ECG route illustration component is imported on homepage ECG marketing", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-homepage-ecg.tsx"), "utf8");
  const importLines = src.split("\n").filter((l) => l.trim().startsWith("import "));
  const illustrationImports = importLines.filter((l) => /ecg|telemetry|strip/i.test(l) && !l.includes("premium-homepage-hero"));
  assert.equal(
    illustrationImports.length,
    0,
    `unexpected extra illustration imports: ${illustrationImports.join("; ")}`,
  );
});
