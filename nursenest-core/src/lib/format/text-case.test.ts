import assert from "node:assert/strict";
import test from "node:test";

import {
  formatDisplayTitle,
  formatSentenceCase,
  formatTitleCase,
  validateEnglishCapitalization,
} from "@/lib/format/text-case";

test("formatTitleCase preserves medical acronyms and clinical chrome labels", () => {
  assert.equal(formatTitleCase("select country"), "Select Country");
  assert.equal(formatTitleCase("clinical tools"), "Clinical Tools");
  assert.equal(formatTitleCase("lab values reference"), "Lab Values Reference");
  assert.equal(formatTitleCase("electrolyte & abg simulator"), "Electrolyte & ABG Simulator");
  assert.equal(formatTitleCase("send me practice questions"), "Send Me Practice Questions");
  assert.equal(formatTitleCase("view all languages"), "View All Languages");
  assert.equal(formatTitleCase("open iv medication review"), "Open IV Medication Review");
  assert.equal(formatTitleCase("launch cat exam"), "Launch CAT Exam");
});

test("formatDisplayTitle is the canonical NurseNest title renderer", () => {
  assert.equal(formatDisplayTitle("clinical lab workstation"), "Clinical Lab Workstation");
  assert.equal(formatDisplayTitle("medication calculation practice"), "Medication Calculation Practice");
  assert.equal(formatDisplayTitle("everything you need to pass"), "Everything You Need To Pass");
  assert.equal(formatDisplayTitle("ecg interpretation hub"), "ECG Interpretation Hub");
  assert.equal(formatDisplayTitle("osce practice in picu and ed"), "OSCE Practice in PICU and ED");
});

test("formatSentenceCase leaves mixed-case authored prose and acronyms intact", () => {
  assert.equal(formatSentenceCase("clinical tools"), "Clinical tools");
  assert.equal(formatSentenceCase("review ECG and ABG values"), "Review ECG and ABG values");
  assert.equal(formatSentenceCase("Lab Values Reference"), "Lab Values Reference");
});

test("English capitalization policy enforces title case for chrome contexts only", () => {
  assert.deepEqual(validateEnglishCapitalization("Select Country", "control", "en"), {
    ok: true,
    normalized: "Select Country",
    issues: [],
  });
  assert.deepEqual(validateEnglishCapitalization("Select country", "nav", "en"), {
    ok: false,
    normalized: "Select Country",
    issues: ["not-title-case"],
  });
  assert.deepEqual(validateEnglishCapitalization("View all languages →", "cta", "en"), {
    ok: false,
    normalized: "View All Languages",
    issues: ["not-title-case"],
  });
  assert.deepEqual(validateEnglishCapitalization("View all languages →", "prose", "en"), {
    ok: true,
    normalized: "View all languages",
    issues: [],
  });
});

test("English capitalization policy skips non-English locales", () => {
  assert.deepEqual(validateEnglishCapitalization("sélectionner le pays", "nav", "fr"), {
    ok: true,
    normalized: "sélectionner le pays",
    issues: [],
  });
});
