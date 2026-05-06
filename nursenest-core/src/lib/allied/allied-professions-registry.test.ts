import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ALLIED_PROFESSIONS,
  ALLIED_HUB_CATEGORY_ORDER,
  alliedProfessionsGroupedForHub,
} from "@/lib/allied/allied-professions-registry";
import { professionKeyToCareerKey } from "@/lib/pricing/display-catalog";

describe("allied professions registry", () => {
  it("includes expanded occupation tracks for the marketing hub", () => {
    assert.ok(ALLIED_PROFESSIONS.length >= 18);
    const keys = new Set(ALLIED_PROFESSIONS.map((p) => p.professionKey));
    for (const k of [
      "psw-hca",
      "medical-assistant",
      "dental-assistant",
      "dental-hygiene",
      "emt",
      "sonography",
      "radiography",
      "lab-assistant",
      "dietetic-technician",
      "mental-health-addictions",
      "community-health-worker",
    ]) {
      assert.ok(keys.has(k), `missing professionKey: ${k}`);
    }
  });

  it("groups every profession into a hub category", () => {
    const grouped = alliedProfessionsGroupedForHub();
    for (const id of ALLIED_HUB_CATEGORY_ORDER) {
      assert.ok(grouped.has(id));
    }
    const total = ALLIED_HUB_CATEGORY_ORDER.reduce((n, id) => n + (grouped.get(id)?.length ?? 0), 0);
    assert.equal(total, ALLIED_PROFESSIONS.length);
  });

  it("maps new marketing profession keys to billing career lanes", () => {
    assert.equal(professionKeyToCareerKey("psw-hca"), "socialwork");
    assert.equal(professionKeyToCareerKey("emt"), "paramedic");
    assert.equal(professionKeyToCareerKey("radiography"), "imaging");
    assert.equal(professionKeyToCareerKey("lab-assistant"), "mlt");
  });
});
