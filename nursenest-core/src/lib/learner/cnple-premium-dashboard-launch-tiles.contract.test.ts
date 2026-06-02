import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function source(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("CNPLE premium learner dashboard launch tile", () => {
  it("detects CNPLE using the central pathway helper", () => {
    const src = source("src/lib/learner/premium-dashboard-launch-tiles.ts");
    assert.match(src, /import \{ isCnplePathway \} from "@\/lib\/exam-pathways\/cnple-pathway"/);
    assert.match(src, /const cnple = isCnplePathway/);
  });

  it("routes CNPLE simulation to the LOFT case engine, not CAT start", () => {
    const src = source("src/lib/learner/premium-dashboard-launch-tiles.ts");
    assert.match(src, /const catHref = cnple \? "\/app\/cases\/cnple" : catStartHrefFromPremiumSnapshot\(snapshot\)/);
  });

  it("labels the CNPLE launch tile as LOFT Simulation", () => {
    const src = source("src/lib/learner/premium-dashboard-launch-tiles.ts");
    assert.match(src, /title: cnple \? "LOFT Simulation" : t\("learner\.shell\.nav\.cat"\)/);
    assert.match(src, /cta: cnple \? "Start simulation" : t\("learner\.studyModes\.cat\.cta"\)/);
  });
});
