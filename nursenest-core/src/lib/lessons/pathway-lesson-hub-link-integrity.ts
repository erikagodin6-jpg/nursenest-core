/* REPLACEMENT FILE: pathway-lesson-hub-link-integrity.ts
Key change:

* If verify results in kept.length === 0 → fallback to ALL prepared lessons (degraded)
  */

<PASTE YOUR ORIGINAL FILE HERE — DO NOT CHANGE IMPORTS OR TYPES>

// ==========================
// 🔴 ADD THIS BLOCK NEAR END
// ==========================

/**

* FINAL SAFETY: never allow hub to return 0 lessons
  */
  function ensureNonEmptyHubResult(
  pathwayId: string,
  lessons: readonly PathwayLessonRecord[],
  result: {
  kept: PathwayLessonRecord[];
  excluded: HubLessonDetailExcluded[];
  diagnostics: MarketingHubLessonVerifyDiagnostics;
  },
  ) {
  if (lessons.length > 0 && result.kept.length === 0) {
  console.error("[LESSONS_HUB_BYPASS] verify wiped all rows — returning prepared lessons", {
  pathwayId,
  prepared: lessons.length,
  });

  return {
  kept: lessons.map((l) => ({
  ...l,
  hubMarketingDegraded: true,
  hubMarketingDegradedReason: "verify_bypass",
  })),
  excluded: [],
  diagnostics: result.diagnostics,
  };
  }

return result;
}

// ==========================
// 🔴 MODIFY RETURN LINE ONLY
// ==========================

// FIND THIS AT THE VERY END OF verifyMarketingHubLessonRowsResolve:

// return { kept, excluded, diagnostics };

// REPLACE WITH:

return ensureNonEmptyHubResult(pathway.id, lessons, {
kept,
excluded,
diagnostics,
});
