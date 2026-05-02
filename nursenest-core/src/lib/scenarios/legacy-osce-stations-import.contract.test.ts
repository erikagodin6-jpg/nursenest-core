import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getLegacyOsceHubListItems,
  getLegacyOsceSkillStationById,
  getMergedLegacyOsceSkillStations,
} from "@/lib/scenarios/legacy-osce-stations-runtime";
import { listLegacyOsceMigrationCandidates } from "@/lib/scenarios/legacy-osce-content-import";

describe("Legacy OSCE skills import (bundled @legacy-client)", () => {
  it("merges all legacy OSCE skill station files (69 stations)", () => {
    const merged = getMergedLegacyOsceSkillStations();
    assert.equal(merged.length, 69);
    const ids = new Set(merged.map((s) => s.id));
    assert.equal(ids.size, 69, "station ids must be unique across bundles");
  });

  it("exposes list items for OSCE hub cards", () => {
    const rows = getLegacyOsceHubListItems();
    assert.equal(rows.length, 69);
    assert.ok(rows.some((r) => r.title === "Head-to-Toe Assessment"));
  });

  it("resolves a known station with full teaching fields", () => {
    const s = getLegacyOsceSkillStationById("head-to-toe-assessment");
    assert.ok(s);
    assert.ok(s!.scenarioIntro.length > 40);
    assert.ok(s!.steps.length >= 5);
    assert.ok(s!.passingCriteria.length > 10);
  });

  it("listLegacyOsceMigrationCandidates mirrors merged count", () => {
    const c = listLegacyOsceMigrationCandidates();
    assert.equal(c.length, 69);
    assert.ok(c.every((r) => r.stationId && r.title));
  });
});
