import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getLegacyOsceHubListItems,
  getLegacyOsceSkillStationById,
  getMergedLegacyOsceSkillStations,
} from "@/lib/scenarios/legacy-osce-stations-runtime";
import { listLegacyOsceMigrationCandidates } from "@/lib/scenarios/legacy-osce-content-import";

describe("Legacy OSCE skills import (bundled @legacy-client)", () => {
  it("keeps legacy OSCE bundle imports disabled", () => {
    const merged = getMergedLegacyOsceSkillStations();
    assert.equal(merged.length, 0);
  });

  it("exposes an empty legacy hub list when legacy fallback is disabled", () => {
    const rows = getLegacyOsceHubListItems();
    assert.deepEqual(rows, []);
  });

  it("does not resolve legacy station ids after disabling legacy imports", () => {
    const s = getLegacyOsceSkillStationById("head-to-toe-assessment");
    assert.equal(s, null);
  });

  it("listLegacyOsceMigrationCandidates mirrors disabled legacy imports", () => {
    const c = listLegacyOsceMigrationCandidates();
    assert.deepEqual(c, []);
  });
});
