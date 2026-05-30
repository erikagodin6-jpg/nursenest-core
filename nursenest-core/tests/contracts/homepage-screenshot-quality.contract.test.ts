import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import sharp from "sharp";

const requiredScreenshots = [
  "question-bank-demo",
  "ngn-bowtie-demo",
  "cat-exam-demo",
  "lesson-demo",
  "ecg-demo",
  "telemetry-shift-demo",
  "lab-workstation-demo",
  "med-math-demo",
  "pharmacology-demo",
  "clinical-skills-demo",
  "readiness-report-demo",
  "ngn-matrix-demo",
] as const;

const marketingScreenshots = [
  "answered-nclex-question",
  "ngn-bowtie",
  "ngn-matrix",
  "cat-exam",
  "lesson-page",
  "ecg-detective-mode",
  "telemetry-shift-simulator",
  "clinical-lab-workstation",
  "medication-math",
  "pharmacology",
  "clinical-skills",
  "readiness-dashboard",
] as const;

test("homepage uses dedicated high-resolution product demo screenshots", async () => {
  const home = readFileSync("src/components/marketing/home/homepage-ecosystem-discovery.tsx", "utf8");

  for (const shot of requiredScreenshots) {
    assert.match(home, new RegExp(`homepageShot\\("${shot}"`));
    assert.equal(existsSync(`public/images/homepage/${shot}.png`), true, `${shot}.png exists`);
    assert.equal(existsSync(`public/images/homepage/${shot}-mobile.png`), true, `${shot}-mobile.png exists`);

    const desktop = await sharp(`public/images/homepage/${shot}.png`).metadata();
    const mobile = await sharp(`public/images/homepage/${shot}-mobile.png`).metadata();
    assert.ok((desktop.width ?? 0) >= 1600, `${shot}.png should be at least 1600px wide`);
    assert.ok((mobile.width ?? 0) >= 1600, `${shot}-mobile.png should be at least 1600px wide`);
    assert.equal(desktop.format, "png");
    assert.equal(mobile.format, "png");
  }
});

test("homepage screenshots are paired with conversion-focused feature sections", () => {
  const home = readFileSync("src/components/marketing/home/homepage-ecosystem-discovery.tsx", "utf8");
  const css = readFileSync("src/app/homepage-ecosystem-overhaul.css", "utf8");

  for (const label of [
    "Question Bank",
    "Next Generation NCLEX",
    "CAT Exam",
    "Lessons",
    "ECG & Telemetry",
    "Medication Math",
    "Profile + Report Card",
    "Telemetry Shift",
    "Clinical Lab Workstation",
    "Pharmacology",
    "Clinical Skills",
    "What You Get With NurseNest",
    "Learner Momentum",
    "For Nursing Schools",
  ]) {
    assert.match(home, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(home, /nn-home-product-demo-stack/);
  assert.match(home, /data-nn-home-product-demo/);
  assert.match(css, /nn-home-product-demo/);
  assert.match(home, /featureCount\(stats/);
  assert.match(home, /Readiness Scores/);
  assert.match(home, /Adaptive Remediation/);
});

test("homepage screenshot generator captures live UI routes at retina scale", () => {
  const script = readFileSync("scripts/generate-homepage-screenshots.ts", "utf8");
  const marketingScript = readFileSync("scripts/marketing-screenshot-generator.ts", "utf8");
  const pkg = readFileSync("package.json", "utf8");

  assert.match(pkg, /generate:homepage-screenshots/);
  assert.match(pkg, /generate:marketing-homepage-screenshots/);
  assert.match(script, /chromium\.launch/);
  assert.match(script, /deviceScaleFactor: 2/);
  assert.match(script, /deviceScaleFactor: 4/);
  assert.match(script, /public", "images", "homepage"/);
  assert.match(script, /\/app\/practice-tests/);
  assert.match(script, /\/app\/med-calculations/);
  assert.match(script, /\/app\/account\/readiness/);
  assert.match(script, /Set QA_PAID_EMAIL\/QA_PAID_PASSWORD/);
  assert.match(marketingScript, /public", "images", "marketing"/);
  assert.match(marketingScript, /-tablet/);
  assert.match(marketingScript, /-mobile/);
  assert.match(marketingScript, /ecg-detective-mode/);
  assert.match(marketingScript, /telemetry-shift-simulator/);
});

test("marketing screenshot library has retina desktop tablet and mobile PNGs", async () => {
  for (const shot of marketingScreenshots) {
    for (const suffix of ["", "-tablet", "-mobile"]) {
      const file = `public/images/marketing/${shot}${suffix}.png`;
      assert.equal(existsSync(file), true, `${file} exists`);
      const meta = await sharp(file).metadata();
      assert.ok((meta.width ?? 0) >= 1600, `${file} should be at least 1600px wide`);
      assert.equal(meta.format, "png");
    }
  }
});

test("hero uses a css-driven screenshot carousel with three proof slides", () => {
  const hero = readFileSync("src/components/marketing/home/premium-homepage-hero.tsx", "utf8");
  const css = readFileSync("src/app/styles/marketing/hero.css", "utf8");

  assert.match(hero, /HERO_CAROUSEL_SLIDES/);
  assert.match(hero, /Answered Question/);
  assert.match(hero, /CAT Exam/);
  assert.match(hero, /ECG Detective Mode/);
  assert.match(css, /nn-hero-proof-carousel 13\.5s infinite/);
  assert.match(css, /animation-delay: calc\(var\(--nn-hero-slide-index\) \* 4\.5s\)/);
});
