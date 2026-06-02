import test from "node:test";
import assert from "node:assert/strict";
import {
  extractClinicalPearlLines,
  normalizeClinicalPearlLines,
} from "@/lib/lessons/extract-clinical-pearl-lines";

test("extractClinicalPearlLines omits marker-only pearl bodies", () => {
  const warnings: unknown[][] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args);
  };
  try {
    assert.deepEqual(
      extractClinicalPearlLines("Pearl:", {
        pathwayId: "ca-rn-nclex-rn",
        lessonSlug: "example",
        source: "unit-test",
      }),
      [],
    );
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warnings.length, process.env.NODE_ENV === "production" ? 0 : 1);
});

test("extractClinicalPearlLines renders only pearls with educational body text", () => {
  assert.deepEqual(
    extractClinicalPearlLines(
      "- Pearl:\n- Pearl: Do not delay escalation when oxygenation and mentation worsen together.\n- Clinical Pearl: Stable chronic changes are less urgent than acute deterioration.",
    ),
    [
      {
        label: "Pearl",
        text: "Do not delay escalation when oxygenation and mentation worsen together.",
      },
      {
        label: "Pearl",
        text: "Stable chronic changes are less urgent than acute deterioration.",
      },
    ],
  );
});

test("normalizeClinicalPearlLines removes empty UI pearl objects", () => {
  const warnings: unknown[][] = [];
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    warnings.push(args);
  };
  try {
    assert.deepEqual(
      normalizeClinicalPearlLines([
        { label: "Pearl", text: "" },
        { label: "Exam trap", text: "Treat a sudden change as urgent until proven otherwise." },
      ]),
      [
        {
          label: "Exam trap",
          text: "Treat a sudden change as urgent until proven otherwise.",
        },
      ],
    );
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warnings.length, process.env.NODE_ENV === "production" ? 0 : 1);
});
