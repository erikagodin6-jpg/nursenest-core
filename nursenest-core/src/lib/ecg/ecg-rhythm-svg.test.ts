import assert from "node:assert/strict";
import test from "node:test";
import { getEcgRhythmFixture, type EcgRhythmId } from "@/lib/ecg/ecg-rhythm-svg";

const IDS: EcgRhythmId[] = [
  "nsr",
  "sinus_brady",
  "sinus_tachy",
  "afib",
  "pvc",
  "svt",
  "vt",
  "vfib",
  "heart_block",
  "paced",
  "st_elevation",
  "hyperk",
  "long_qt",
  "pulseless",
];

test("each rhythm fixture has non-empty SVG path", () => {
  for (const id of IDS) {
    const f = getEcgRhythmFixture(id);
    assert.ok(f.pathD.length > 20, id);
    assert.match(f.pathD, /^M/);
  }
});
