import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

const read = (path) => readFileSync(join(ROOT, path), "utf8");

test("ECG Phase 3 exposes an interactive learner route wired into navigation", () => {
  assert.equal(existsSync(join(ROOT, "src/app/(app)/modules/ecg/interactive/page.tsx")), true);

  const component = read("src/components/ecg-module/ecg-interactive-ecosystem-client.tsx");
  const nav = read("src/lib/ecg-module/ecg-workstation-nav.ts");
  const hub = read("src/components/ecg-module/ecg-module-hub.tsx");

  for (const required of [
    "ECG Detective Mode",
    "Compare and Contrast",
    "Telemetry Shift Simulator",
    "Rhythm Deterioration Engine",
    "ECG Readiness Dashboard",
    "ECG Clearances",
    "ECG Report Card",
    "Adaptive ECG Remediation",
    "createDetectiveSession",
    "createTelemetryShiftSession",
    "createDeteriorationSession",
    "generateEcgStudyPlan",
  ]) {
    assert.match(component, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(nav, /\/modules\/ecg\/interactive/);
  assert.match(hub, /Open Interactive Reasoning/);
});

test("ECG Phase 3 required compare pairs, clearance, screenshots, and competitive analysis are documented", () => {
  const ecosystem = read("src/lib/ecg-module/ecg-interactive-ecosystem.ts");
  const clearances = read("src/lib/ecg-module/ecg-clearances.ts");
  const manifest = read("docs/reports/ecg-phase3/marketing-screenshot-manifest.json");
  const competitive = read("docs/reports/ecg-phase3/ecg-competitive-analysis.md");

  for (const pair of [
    "afib-vs-flutter",
    "mobitz1-vs-mobitz2",
    "vt-vs-svt",
    "pac-vs-pvc",
    "rbbb-vs-lbbb",
    "stemi-vs-nstemi",
    "junctional-vs-sinus-bradycardia",
    "hyperkalemia-vs-hypokalemia",
  ]) {
    assert.match(ecosystem, new RegExp(pair));
  }

  assert.match(clearances, /Critical Care ECG Ready/);

  for (const mode of ["detective", "telemetry", "compare", "readiness", "clearances", "deterioration", "report-card"]) {
    assert.match(manifest, new RegExp(`"mode": "${mode}"`));
  }

  for (const competitor of ["SkillStat", "Life In The Fast Lane", "ECG Academy", "NurseInTheMaking", "LevelUpRN", "UWorld"]) {
    assert.match(competitive, new RegExp(competitor));
  }
});
