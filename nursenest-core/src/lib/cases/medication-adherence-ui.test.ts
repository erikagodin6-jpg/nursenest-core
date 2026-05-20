/**
 * Medication adherence UI logic tests.
 *
 * Tests the pure functions that drive MedicationAdherenceListSurface:
 * mergeAdherenceWithMedications, ADHERENCE_STATUS_CONFIG, and adherenceStatusLabel.
 *
 * Run: `npx tsx --test src/lib/cases/medication-adherence-ui.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mergeAdherenceWithMedications,
  adherenceStatusLabel,
  ADHERENCE_STATUS_CONFIG,
  buildMedicationAdherenceRecords,
  getActiveMedicationNames,
} from "@/lib/cases/medication-adherence";
import type { MedicationAdherenceRecord } from "@/lib/cases/longitudinal-case-types";
import { CASE_HYPERTENSION_FOLLOWUP } from "@/content/cases/cnple-sample-cases";

// ── ADHERENCE_STATUS_CONFIG ───────────────────────────────────────────────────

describe("ADHERENCE_STATUS_CONFIG — badge config completeness", () => {
  const allStatuses: MedicationAdherenceRecord["status"][] = [
    "started", "active", "delayed", "refused",
    "contraindicated", "duplicated", "stopped",
  ];

  it("has a config entry for every status", () => {
    for (const status of allStatuses) {
      assert.ok(ADHERENCE_STATUS_CONFIG[status], `Missing config for status: ${status}`);
    }
  });

  it("contraindicated is danger severity", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.contraindicated.severity, "danger");
  });

  it("contraindicated has a clinical note", () => {
    assert.ok(ADHERENCE_STATUS_CONFIG.contraindicated.clinicalNote !== null);
    assert.match(ADHERENCE_STATUS_CONFIG.contraindicated.clinicalNote!, /[Ss]afety/);
  });

  it("duplicated is warning severity", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.duplicated.severity, "warning");
  });

  it("duplicated has a clinical note about duplicate therapy", () => {
    assert.ok(ADHERENCE_STATUS_CONFIG.duplicated.clinicalNote !== null);
    assert.match(ADHERENCE_STATUS_CONFIG.duplicated.clinicalNote!, /duplicate/i);
  });

  it("started is success severity", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.started.severity, "success");
  });

  it("started has no clinical note (not a warning)", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.started.clinicalNote, null);
  });

  it("active has none severity (no badge rendered)", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.active.severity, "none");
  });

  it("stopped dims the row", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.stopped.dimRow, true);
  });

  it("refused dims the row", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.refused.dimRow, true);
  });

  it("contraindicated does NOT dim the row (stays prominent)", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.contraindicated.dimRow, false);
  });

  it("delayed has a clinical note about monitoring", () => {
    assert.ok(ADHERENCE_STATUS_CONFIG.delayed.clinicalNote !== null);
    assert.match(ADHERENCE_STATUS_CONFIG.delayed.clinicalNote!, /monitor/i);
  });

  it("stopped has a clinical note about the trajectory", () => {
    assert.ok(ADHERENCE_STATUS_CONFIG.stopped.clinicalNote !== null);
    assert.match(ADHERENCE_STATUS_CONFIG.stopped.clinicalNote!, /stop/i);
  });
});

// ── adherenceStatusLabel ──────────────────────────────────────────────────────

describe("adherenceStatusLabel", () => {
  it("returns correct labels for all statuses", () => {
    const expected: Record<MedicationAdherenceRecord["status"], string> = {
      started: "Started",
      active: "Ongoing",
      delayed: "Delayed",
      refused: "Refused",
      contraindicated: "Contraindicated",
      duplicated: "Duplicate",
      stopped: "Stopped",
    };
    for (const [status, label] of Object.entries(expected) as [MedicationAdherenceRecord["status"], string][]) {
      assert.equal(adherenceStatusLabel(status), label, `Wrong label for ${status}`);
    }
  });
});

// ── mergeAdherenceWithMedications ─────────────────────────────────────────────

describe("mergeAdherenceWithMedications — basic merge", () => {
  const baseMeds = [
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "HTN" },
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "DM" },
    { name: "Atorvastatin", dose: "20 mg", route: "PO", frequency: "nightly", indication: "Dyslipidaemia" },
  ];

  it("preserves all medication details", () => {
    const merged = mergeAdherenceWithMedications(baseMeds, []);
    assert.equal(merged.length, 3);
    const ramipril = merged.find((m) => m.name === "Ramipril");
    assert.ok(ramipril);
    assert.equal(ramipril!.dose, "5 mg");
    assert.equal(ramipril!.route, "PO");
    assert.equal(ramipril!.indication, "HTN");
  });

  it("assigns null status when no adherence record matches", () => {
    const merged = mergeAdherenceWithMedications(baseMeds, []);
    for (const m of merged) {
      assert.equal(m.status, null, `Expected null status for ${m.name}`);
    }
  });

  it("assigns correct status from adherence records", () => {
    const records: MedicationAdherenceRecord[] = [
      { name: "ramipril", status: "active", stepIndex: 1 },
      { name: "metformin", status: "started", stepIndex: 1 },
      { name: "atorvastatin", status: "stopped", stepIndex: 1 },
    ];
    const merged = mergeAdherenceWithMedications(baseMeds, records);
    assert.equal(merged.find((m) => m.name === "Ramipril")!.status, "active");
    assert.equal(merged.find((m) => m.name === "Metformin")!.status, "started");
    assert.equal(merged.find((m) => m.name === "Atorvastatin")!.status, "stopped");
  });

  it("matching is case-insensitive", () => {
    const records: MedicationAdherenceRecord[] = [
      { name: "RAMIPRIL", status: "contraindicated", stepIndex: 1 },
    ];
    const merged = mergeAdherenceWithMedications(baseMeds, records);
    assert.equal(merged.find((m) => m.name === "Ramipril")!.status, "contraindicated");
  });

  it("appends adherence-only entries not in original med list", () => {
    const records: MedicationAdherenceRecord[] = [
      { name: "canagliflozin", status: "started", stepIndex: 2 },
    ];
    const merged = mergeAdherenceWithMedications(baseMeds, records);
    assert.equal(merged.length, 4);
    const sglt2 = merged.find((m) => m.name === "canagliflozin");
    assert.ok(sglt2, "New medication from adherence records must be appended");
    assert.equal(sglt2!.status, "started");
  });

  it("does not create duplicates", () => {
    const records: MedicationAdherenceRecord[] = [
      { name: "ramipril", status: "active", stepIndex: 1 },
      { name: "ramipril", status: "contraindicated", stepIndex: 2 }, // second record — first wins
    ];
    const merged = mergeAdherenceWithMedications(baseMeds, records);
    const ramiprilEntries = merged.filter((m) => m.name.toLowerCase() === "ramipril");
    assert.equal(ramiprilEntries.length, 1, "Duplicate names must not appear twice");
  });
});

describe("mergeAdherenceWithMedications — edge cases", () => {
  it("handles empty meds list", () => {
    const records: MedicationAdherenceRecord[] = [
      { name: "atorvastatin", status: "started", stepIndex: 1 },
    ];
    const merged = mergeAdherenceWithMedications([], records);
    assert.equal(merged.length, 1);
    assert.equal(merged[0]!.status, "started");
  });

  it("handles empty adherence records", () => {
    const meds = [{ name: "Metformin", dose: "500 mg" }];
    const merged = mergeAdherenceWithMedications(meds, []);
    assert.equal(merged.length, 1);
    assert.equal(merged[0]!.status, null);
  });

  it("handles both empty", () => {
    const merged = mergeAdherenceWithMedications([], []);
    assert.equal(merged.length, 0);
  });

  it("preserves medication order from original list", () => {
    const meds = [
      { name: "Metformin" },
      { name: "Ramipril" },
      { name: "Atorvastatin" },
    ];
    const merged = mergeAdherenceWithMedications(meds, []);
    assert.equal(merged[0]!.name, "Metformin");
    assert.equal(merged[1]!.name, "Ramipril");
    assert.equal(merged[2]!.name, "Atorvastatin");
  });
});

// ── Integration: buildMedicationAdherenceRecords for hypertension case ────────

describe("buildMedicationAdherenceRecords — hypertension case integration", () => {
  it("initial medications are active at step 0", () => {
    const records = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 0);
    assert.ok(records.every((r) => r.status === "active"), "All initial medications must start as active");
  });

  it("naproxen transitions to stopped after step 1 discontinuation", () => {
    const records = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 1);
    const naproxen = records.find((r) => r.name.toLowerCase().includes("naproxen"));
    assert.ok(naproxen, "Naproxen must appear in records");
    assert.equal(naproxen!.status, "stopped", `Expected stopped, got ${naproxen!.status}`);
  });

  it("canagliflozin is started at step 2", () => {
    const records = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 2);
    const canagliflozin = records.find((r) => r.name.toLowerCase().includes("canagliflozin"));
    assert.ok(canagliflozin, "Canagliflozin must appear at step 2");
    assert.ok(
      canagliflozin!.status === "started" || canagliflozin!.status === "active",
      `Expected started or active, got ${canagliflozin!.status}`,
    );
  });

  it("atorvastatin dose change keeps it as active", () => {
    const records = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 2);
    const statin = records.find((r) => r.name.toLowerCase().includes("atorvastatin"));
    assert.ok(statin, "Atorvastatin must be in records");
    assert.equal(statin!.status, "active", "Changed dose still means active medication");
  });
});

// ── Merge with real case medications ─────────────────────────────────────────

describe("mergeAdherenceWithMedications — real case medications", () => {
  it("merged list at step 2 includes naproxen as stopped", () => {
    const adherenceRecords = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 1);
    const caseMeds = CASE_HYPERTENSION_FOLLOWUP.medications.map((m) => ({
      name: m.name,
      dose: m.dose,
      route: m.route,
      frequency: m.frequency,
      indication: m.indication,
    }));
    const merged = mergeAdherenceWithMedications(caseMeds, adherenceRecords);
    const naproxen = merged.find((m) => m.name.toLowerCase().includes("naproxen"));
    assert.ok(naproxen, "Naproxen must appear in merged list");
    assert.equal(naproxen!.status, "stopped");
  });

  it("stopped naproxen is NOT in active medication names", () => {
    const adherenceRecords = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 1);
    const active = getActiveMedicationNames(adherenceRecords);
    assert.ok(!active.some((n) => n.toLowerCase().includes("naproxen")), "Stopped naproxen must not be in active list");
  });

  it("ramipril remains in active medication names at step 1", () => {
    const adherenceRecords = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 1);
    const active = getActiveMedicationNames(adherenceRecords);
    assert.ok(active.some((n) => n.toLowerCase().includes("ramipril")), "Ramipril must remain active");
  });

  it("contraindicated medication is not in active names", () => {
    const records: MedicationAdherenceRecord[] = [
      { name: "Ramipril", status: "contraindicated", stepIndex: 1 },
      { name: "Metformin", status: "active", stepIndex: 1 },
    ];
    const active = getActiveMedicationNames(records);
    assert.ok(!active.some((n) => n.toLowerCase().includes("ramipril")), "Contraindicated medication must not be active");
    assert.ok(active.some((n) => n.toLowerCase().includes("metformin")), "Active medication must be in active list");
  });
});

// ── Shell guards: no crash when evolvedState is absent ────────────────────────

describe("mergeAdherenceWithMedications — shell-level null safety", () => {
  it("empty adherence records produces all-null-status entries without throwing", () => {
    const meds = [{ name: "Aspirin", dose: "81 mg", route: "PO", frequency: "daily" }];
    const result = mergeAdherenceWithMedications(meds, []);
    assert.equal(result.length, 1);
    assert.equal(result[0]!.status, null);
    assert.doesNotThrow(() => mergeAdherenceWithMedications(meds, []));
  });

  it("undefined-like empty arrays produce empty result", () => {
    assert.doesNotThrow(() => mergeAdherenceWithMedications([], []));
    assert.equal(mergeAdherenceWithMedications([], []).length, 0);
  });
});

// ── UI badge correctness assertions ──────────────────────────────────────────

describe("badge label correctness for UI rendering", () => {
  it("contraindicated badge label is 'Contraindicated'", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.contraindicated.badgeLabel, "Contraindicated");
  });

  it("duplicate badge label is 'Duplicate'", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.duplicated.badgeLabel, "Duplicate");
  });

  it("started badge label is 'Started'", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.started.badgeLabel, "Started");
  });

  it("delayed badge label is 'Delayed'", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.delayed.badgeLabel, "Delayed");
  });

  it("refused badge label is 'Refused'", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.refused.badgeLabel, "Refused");
  });

  it("stopped badge label is 'Stopped'", () => {
    assert.equal(ADHERENCE_STATUS_CONFIG.stopped.badgeLabel, "Stopped");
  });
});

// ── Severity token mapping ────────────────────────────────────────────────────

describe("severity assignments for theme compatibility", () => {
  it("all severity values are valid token types", () => {
    const validSeverities = new Set(["success", "warning", "danger", "muted", "none"]);
    for (const [status, config] of Object.entries(ADHERENCE_STATUS_CONFIG)) {
      assert.ok(
        validSeverities.has(config.severity),
        `Status ${status} has invalid severity: ${config.severity}`,
      );
    }
  });

  it("no hardcoded colour values in config (severity tokens only)", () => {
    // Verify that no entry contains raw CSS colour values
    const serialized = JSON.stringify(ADHERENCE_STATUS_CONFIG);
    assert.ok(!serialized.includes("#"), "Config must not contain hex colours");
    assert.ok(!serialized.includes("rgb("), "Config must not contain rgb() colours");
    assert.ok(!serialized.includes("hsl("), "Config must not contain hsl() colours");
  });
});

// ── Step-change hydration (same-step visibility) ──────────────────────────────

describe("mergeAdherenceWithMedications — step-change hydration", () => {
  const baseMeds = [
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "HTN" },
  ];

  it("newly started medication is hydrated from stepChanges immediately", () => {
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "ramipril", status: "active", stepIndex: 0 },
      { name: "canagliflozin", status: "started", stepIndex: 2 },
    ];
    const stepChanges = [
      { name: "Canagliflozin", dose: "100 mg", route: "PO", frequency: "daily", indication: "T2DM + CV protection", flag: "new" as const },
    ];
    const merged = mergeAdherenceWithMedications(baseMeds, adherenceRecords, stepChanges);
    const sglt2 = merged.find((m) => m.name.toLowerCase().includes("canagliflozin"));
    assert.ok(sglt2, "Canagliflozin must appear in merged list");
    assert.equal(sglt2!.dose, "100 mg", "Dose must be hydrated from stepChanges");
    assert.equal(sglt2!.route, "PO", "Route must be hydrated from stepChanges");
    assert.equal(sglt2!.frequency, "daily", "Frequency must be hydrated from stepChanges");
    assert.equal(sglt2!.indication, "T2DM + CV protection", "Indication must be hydrated from stepChanges");
  });

  it("isNewThisStep is set for medication with flag=new in stepChanges", () => {
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "canagliflozin", status: "started", stepIndex: 2 },
    ];
    const stepChanges = [
      { name: "Canagliflozin", dose: "100 mg", flag: "new" as const },
    ];
    const merged = mergeAdherenceWithMedications([], adherenceRecords, stepChanges);
    const sglt2 = merged.find((m) => m.name.toLowerCase().includes("canagliflozin"));
    assert.ok(sglt2, "Canagliflozin must appear");
    assert.equal(sglt2!.isNewThisStep, true, "isNewThisStep must be true for flag=new");
  });

  it("isNewThisStep is set for medication with flag=changed in stepChanges", () => {
    const meds = [{ name: "Atorvastatin", dose: "20 mg", route: "PO", frequency: "nightly" }];
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "atorvastatin", status: "active", stepIndex: 1 },
    ];
    const stepChanges = [
      { name: "Atorvastatin", dose: "40 mg", route: "PO", frequency: "nightly", flag: "changed" as const },
    ];
    const merged = mergeAdherenceWithMedications(meds, adherenceRecords, stepChanges);
    const statin = merged.find((m) => m.name.toLowerCase() === "atorvastatin");
    assert.ok(statin);
    assert.equal(statin!.isNewThisStep, true, "isNewThisStep must be true for dose change");
    assert.equal(statin!.dose, "40 mg", "Dose must be updated from stepChanges");
  });

  it("isNewThisStep is NOT set for medications not in stepChanges", () => {
    const meds = [{ name: "Ramipril", dose: "5 mg" }];
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "ramipril", status: "active", stepIndex: 0 },
    ];
    const merged = mergeAdherenceWithMedications(meds, adherenceRecords, []);
    const ramipril = merged.find((m) => m.name.toLowerCase() === "ramipril");
    assert.ok(ramipril);
    assert.ok(!ramipril!.isNewThisStep, "isNewThisStep must be falsy for unchanged medications");
  });

  it("step changes with flag=discontinued do NOT set isNewThisStep", () => {
    const meds = [{ name: "Naproxen", dose: "220 mg" }];
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "naproxen", status: "stopped", stepIndex: 1 },
    ];
    const stepChanges = [
      { name: "Naproxen", flag: "discontinued" as const },
    ];
    const merged = mergeAdherenceWithMedications(meds, adherenceRecords, stepChanges);
    const naproxen = merged.find((m) => m.name.toLowerCase() === "naproxen");
    assert.ok(naproxen);
    assert.ok(!naproxen!.isNewThisStep, "Discontinued medication must not show isNewThisStep");
  });

  it("step changes with no flag do NOT set isNewThisStep", () => {
    const meds = [{ name: "Metformin", dose: "1000 mg" }];
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "metformin", status: "active", stepIndex: 0 },
    ];
    const stepChanges = [{ name: "Metformin" }];  // No flag
    const merged = mergeAdherenceWithMedications(meds, adherenceRecords, stepChanges);
    const met = merged.find((m) => m.name.toLowerCase() === "metformin");
    assert.ok(met);
    assert.ok(!met!.isNewThisStep, "Missing flag must not set isNewThisStep");
  });

  it("sourceStepIndex is set from adherence record stepIndex", () => {
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "canagliflozin", status: "started", stepIndex: 2 },
    ];
    const merged = mergeAdherenceWithMedications([], adherenceRecords, []);
    const sglt2 = merged.find((m) => m.name.toLowerCase().includes("canagliflozin"));
    assert.ok(sglt2);
    assert.equal(sglt2!.sourceStepIndex, 2, "sourceStepIndex must reflect the step it was added");
  });

  it("step change name casing does not affect matching", () => {
    const meds = [{ name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily" }];
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "metformin", status: "active", stepIndex: 0 },
    ];
    const stepChanges = [{ name: "METFORMIN", dose: "500 mg", flag: "changed" as const }];
    const merged = mergeAdherenceWithMedications(meds, adherenceRecords, stepChanges);
    const met = merged.find((m) => m.name === "Metformin");
    assert.ok(met);
    assert.equal(met!.dose, "500 mg", "Step change dose must override with case-insensitive match");
    assert.equal(met!.isNewThisStep, true);
  });
});

// ── Null safety and no-crash guards ──────────────────────────────────────────

describe("mergeAdherenceWithMedications — null safety", () => {
  it("undefined stepChanges does not throw", () => {
    const meds = [{ name: "Ramipril", dose: "5 mg" }];
    const records: MedicationAdherenceRecord[] = [{ name: "ramipril", status: "active", stepIndex: 0 }];
    assert.doesNotThrow(() => mergeAdherenceWithMedications(meds, records, undefined));
  });

  it("empty stepChanges does not throw", () => {
    const meds = [{ name: "Ramipril" }];
    assert.doesNotThrow(() => mergeAdherenceWithMedications(meds, [], []));
  });

  it("partial medication metadata (no dose) does not crash", () => {
    const meds = [{ name: "SomeDrug" }];  // No dose/route/frequency
    const records: MedicationAdherenceRecord[] = [{ name: "somedrug", status: "started", stepIndex: 1 }];
    const merged = mergeAdherenceWithMedications(meds, records, []);
    assert.equal(merged.length, 1);
    assert.equal(merged[0]!.dose, undefined);
    assert.equal(merged[0]!.status, "started");
  });

  it("adherence record with no matching stepChange still renders name and status", () => {
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "new-drug", status: "contraindicated", stepIndex: 1 },
    ];
    const merged = mergeAdherenceWithMedications([], adherenceRecords, []);
    assert.equal(merged.length, 1);
    assert.equal(merged[0]!.status, "contraindicated");
    assert.equal(merged[0]!.name, "new-drug");
    assert.equal(merged[0]!.dose, undefined);
  });

  it("does not crash if stepChanges contains entries not in meds or adherenceRecords", () => {
    const meds = [{ name: "Ramipril" }];
    const stepChanges = [
      { name: "PhantomDrug", dose: "10 mg", flag: "new" as const },
    ];
    // PhantomDrug is in stepChanges but not in adherenceRecords — it should NOT appear
    // because we only append from adherenceRecords, not stepChanges-only entries
    const merged = mergeAdherenceWithMedications(meds, [], stepChanges);
    assert.ok(!merged.some((m) => m.name.toLowerCase().includes("phantom")),
      "Step changes without matching adherence records must not be appended");
  });
});

// ── Integration with hypertension case: step 2 canagliflozin ─────────────────

describe("mergeAdherenceWithMedications — hypertension case step 2 integration", () => {
  it("canagliflozin appears with dose/route/frequency at step 2 when stepChanges are passed", () => {
    // Simulate what the shell has at step 2:
    // - activeMeds does NOT yet include canagliflozin (updates later via handleContinue)
    // - evolvedState.medicationAdherenceRecords DOES include canagliflozin as "started"
    // - step.medicationChanges DOES include canagliflozin with full details
    const activeMedsAtStep2 = CASE_HYPERTENSION_FOLLOWUP.medications.map((m) => ({
      name: m.name,
      dose: m.dose,
      route: m.route,
      frequency: m.frequency,
      indication: m.indication,
    }));
    // Remove naproxen (stopped at step 1) and add atorvastatin dose change as seen by activeMeds
    // This simulates the state BEFORE handleContinue runs

    const adherenceAtStep2 = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 2);
    const step2Changes = CASE_HYPERTENSION_FOLLOWUP.steps[2]!.medicationChanges;

    const merged = mergeAdherenceWithMedications(activeMedsAtStep2, adherenceAtStep2, step2Changes);

    const canagliflozin = merged.find((m) => m.name.toLowerCase().includes("canagliflozin"));
    assert.ok(canagliflozin, "Canagliflozin must appear in merged list even if not in activeMeds");
    assert.equal(canagliflozin!.status, "started", "Canagliflozin must show started status");

    // step2Changes has canagliflozin: { name: "Canagliflozin", dose: "100 mg", ... }
    if (step2Changes.some((c) => c.name.toLowerCase().includes("canagliflozin"))) {
      assert.ok(canagliflozin!.dose, "Dose must be hydrated from step changes");
      assert.equal(canagliflozin!.isNewThisStep, true, "isNewThisStep must be true");
    }
  });

  it("naproxen is stopped and retained in merged list at step 1", () => {
    const activeMedsAtStep1 = CASE_HYPERTENSION_FOLLOWUP.medications.map((m) => ({
      name: m.name,
      dose: m.dose,
      route: m.route,
      frequency: m.frequency,
      indication: m.indication,
    }));
    const adherenceAtStep1 = buildMedicationAdherenceRecords(CASE_HYPERTENSION_FOLLOWUP, [], 1);
    const step1Changes = CASE_HYPERTENSION_FOLLOWUP.steps[1]!.medicationChanges;

    const merged = mergeAdherenceWithMedications(activeMedsAtStep1, adherenceAtStep1, step1Changes);

    const naproxen = merged.find((m) => m.name.toLowerCase().includes("naproxen"));
    assert.ok(naproxen, "Naproxen must still appear in the list");
    assert.equal(naproxen!.status, "stopped", "Naproxen must show stopped status");
    assert.ok(!naproxen!.isNewThisStep, "Naproxen must not show isNewThisStep");

    // Existing medications must retain their details
    const ramipril = merged.find((m) => m.name.toLowerCase().includes("ramipril"));
    assert.ok(ramipril);
    assert.ok(ramipril!.dose, "Ramipril must retain its dose");
  });

  it("contraindicated medications still show warning state with hydration present", () => {
    const meds = [{ name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily" }];
    const adherenceRecords: MedicationAdherenceRecord[] = [
      { name: "ramipril", status: "contraindicated", stepIndex: 1 },
    ];
    const stepChanges = [{ name: "Ramipril", flag: "hold" as const }];
    const merged = mergeAdherenceWithMedications(meds, adherenceRecords, stepChanges);
    const ramipril = merged.find((m) => m.name.toLowerCase() === "ramipril");
    assert.ok(ramipril);
    assert.equal(ramipril!.status, "contraindicated", "Contraindicated status must be preserved");
    assert.equal(ramipril!.dose, "5 mg", "Existing dose must be retained");
  });
});
