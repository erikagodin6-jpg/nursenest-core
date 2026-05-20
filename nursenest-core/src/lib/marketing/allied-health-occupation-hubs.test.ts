import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { resolveAlliedProfessionFromRouteSlug } from "@/lib/allied/allied-professions-registry";
import { professionKeyToCareerKey } from "@/lib/pricing/display-catalog";

const appRoot = join(process.cwd(), "src/app/(marketing)/(default)/allied-health");
const alliedCareerPage = join(process.cwd(), "src/app/(marketing)/(default)/allied/[career]/page.tsx");

describe("allied health occupation hub routing (marketing)", () => {
  it("main /allied-health page is an occupation chooser (cards), not a regional mega-strip", () => {
    const src = readFileSync(join(appRoot, "page.tsx"), "utf8");
    assert.ok(src.includes("AlliedHubProfessionSections"));
    assert.ok(!src.includes("AlliedHealthRegionStrip"));
    assert.ok(!src.includes("AlliedHeroProfessionScan"));
    assert.ok(src.includes("#allied-professions-heading"));
  });

  it("occupation segment pages render the RN-style AlliedHealthPathwayHub with profession scoping", () => {
    const src = readFileSync(join(appRoot, "[slug]", "page.tsx"), "utf8");
    assert.ok(src.includes("AlliedHealthPathwayHub"));
    assert.ok(src.includes("profession={prof}"));
    assert.ok(src.includes("resolveAlliedProfessionFromRouteSlug"));
  });

  it("canonical /allied/[career] occupation hub uses AlliedHealthPathwayHub with resilient overview loading", () => {
    const src = readFileSync(alliedCareerPage, "utf8");
    assert.ok(src.includes("AlliedHealthPathwayHub"));
    assert.ok(src.includes("profession={prof}"));
    assert.ok(src.includes("fallbackAlliedPathwayHubOverview"));
    assert.ok(src.includes("/allied/${prof.professionKey}"));
  });

  it("resolves known exam-prep segments and rejects unknown slugs", () => {
    const ma = resolveAlliedProfessionFromRouteSlug("medical-assistant-exam-prep");
    assert.ok(ma);
    assert.equal(ma?.professionKey, "medical-assistant");
    assert.equal(resolveAlliedProfessionFromRouteSlug("totally-unknown-occupation-xyz"), undefined);
  });

  it("billing career mapping still resolves for representative allied profession keys", () => {
    assert.equal(professionKeyToCareerKey("psw-hca"), "socialwork");
    assert.equal(professionKeyToCareerKey("medical-assistant"), "ota_pta");
    assert.equal(professionKeyToCareerKey("occupational-therapy"), "ota_pta");
    assert.equal(professionKeyToCareerKey("physiotherapy"), "ota_pta");
    assert.equal(professionKeyToCareerKey("psychotherapy"), "socialwork");
  });

  it("does not change the marketing exam pathway overview wiring for nursing hubs", () => {
    const hubPage = join(process.cwd(), "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/page.tsx");
    const src = readFileSync(hubPage, "utf8");
    assert.ok(src.includes("NursingTierHubPage"));
    assert.ok(src.includes("buildNursingTierHubContent"));
  });
});
