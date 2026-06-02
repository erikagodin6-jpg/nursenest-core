import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const COMPONENT = readFileSync("src/components/marketing/home/homepage-ecosystem-discovery.tsx", "utf8");
const CLIENT = readFileSync("src/components/marketing/home-restored-client.tsx", "utf8");
const SERVER = readFileSync("src/components/marketing/home-restored-with-deferred-stats.server.tsx", "utf8");
const CSS = readFileSync("src/app/homepage-ecosystem-overhaul.css", "utf8");
const FOOTER = readFileSync("src/components/layout/site-footer.tsx", "utf8");
const STATS = readFileSync("src/lib/marketing/public-home-stats-payload.ts", "utf8");

describe("homepage ecosystem discovery overhaul", () => {
  it("renders the flagship feature discovery section immediately after the hero slot", () => {
    assert.match(SERVER, /featureDiscoverySlot/);
    assert.match(CLIENT, /\{heroSlot\}[\s\S]*\{featureDiscoverySlot\}/);
    assert.doesNotMatch(CLIENT, /HomeHeroScreenshotSectionLazy/);
  });

  it("surfaces the requested product breadth", () => {
    for (const label of [
      "Lessons",
      "Flashcards",
      "Practice Questions",
      "CAT Exams",
      "NGN Question Types",
      "ECG & Telemetry",
      "Clinical Labs",
      "Medication Math",
      "Pharmacology",
      "Clinical Skills",
      "Simulations",
      "Study Plans",
      "Readiness Tracking",
      "Weak Area Review",
      "Clinical Scenarios",
      "Report Cards",
    ]) {
      assert.match(COMPONENT, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });

  it("includes NGN, ecosystem, readiness, pathways, gallery, comparison, counters, and institutions sections", () => {
    for (const text of [
      "Next Generation NCLEX Ready",
      "Explore The Learning Ecosystem",
      "Pass The Exam. Be Ready For Practice.",
      "Role-Specific Pathways",
      "Screenshot Gallery",
      "Compare Against Traditional Question Banks",
      "Feature Counters",
      "Built For Schools, Colleges, Universities, And Hospital Programs",
    ]) {
      assert.match(COMPONENT, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });

  it("uses generated screenshot assets and live stats, not hardcoded counter values", () => {
    assert.match(COMPONENT, /marketing\/generated-screenshots/);
    assert.match(COMPONENT, /stats\.questionCount/);
    assert.match(COMPONENT, /stats\.totalFlashcards/);
    assert.match(COMPONENT, /stats\.clinicalSkillCount/);
    assert.match(COMPONENT, /formatCount\(value\)/);
    assert.match(STATS, /publicHomeStaticPlatformInventoryCounts/);
    assert.match(STATS, /listClinicalSkills\(\)\.length/);
    assert.match(STATS, /countMedCalcInventoryForTrack\("rn"\)/);
    assert.match(STATS, /countLabsInventoryForTrack\("rn"\)/);
    assert.match(STATS, /ECG_CLINICAL_REASONING_UNITS\.length/);
  });

  it("keeps the new homepage styling token based", () => {
    assert.match(CSS, /var\(--semantic-brand\)/);
    assert.match(CSS, /var\(--semantic-surface\)/);
    assert.doesNotMatch(CSS, /#[0-9a-fA-F]{3,8}/);
  });

  it("expands footer discovery into the requested groups", () => {
    for (const group of [
      "Learning",
      "Clinical Tools",
      "Exam Prep",
      "Healthcare Careers",
      "Resources",
      "Institutions",
    ]) {
      assert.match(FOOTER, new RegExp(group.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });
});
