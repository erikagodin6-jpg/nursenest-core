import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL,
  EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL,
  EXAM_QUESTION_NON_ECG_TAG_SQL,
  EXAM_QUESTION_RATIONALE_IF_PRESENT_SQL,
  EXAM_QUESTION_RATIONALE_REQUIRED_SQL,
  examQuestionDraftPublishableMinimalRequireRationaleSql,
  examQuestionDraftPublishableMinimalSql,
  examQuestionDraftPublishableStrictSql,
} from "@/lib/questions/exam-question-bank-sql";
import { examQuestionTierInSql } from "@/lib/questions/exam-question-access-sql";
import { draftPublishWhereSql, parseDraftPublishCli } from "@/lib/questions/exam-question-draft-publish";
import {
  aggregateRowToDiagnostics,
  type DraftPublishAggregateRow,
  type DraftPublishDryRunJson,
} from "@/lib/questions/exam-question-draft-publish-metrics";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("parseDraftPublishCli: default minimal", () => {
  const p = parseDraftPublishCli(["node", "script.ts"]);
  assert.equal(p.mode, "minimal");
  assert.equal(p.dryRun, false);
  assert.equal(p.strict, false);
  assert.equal(p.requireRationale, false);
  assert.equal(p.json, false);
});

test("parseDraftPublishCli: strict and dry-run", () => {
  const p = parseDraftPublishCli(["--strict", "--dry-run"]);
  assert.equal(p.mode, "strict");
  assert.equal(p.dryRun, true);
});

test("parseDraftPublishCli: require-rationale", () => {
  const p = parseDraftPublishCli(["--require-rationale", "--dry-run"]);
  assert.equal(p.mode, "minimal_require_rationale");
  assert.equal(p.requireRationale, true);
});

test("parseDraftPublishCli rejects --strict with --require-rationale", () => {
  assert.throws(() => parseDraftPublishCli(["--strict", "--require-rationale"]), /Cannot combine/);
});

test("parseDraftPublishCli rejects --json without --dry-run", () => {
  assert.throws(() => parseDraftPublishCli(["--json"]), /--json is only supported/);
});

test("draftPublishWhereSql selects distinct factories per mode", () => {
  const a = draftPublishWhereSql("minimal");
  const b = draftPublishWhereSql("minimal_require_rationale");
  const c = draftPublishWhereSql("strict");
  assert.notDeepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.notDeepEqual(b, c);
});

test("minimal publish SQL includes stem length, correct_answer JSON gate, optional rationale policy", () => {
  const s = examQuestionDraftPublishableMinimalSql();
  const text = s.strings.join("?");
  assert.match(text, /length\s*\(\s*trim\s*\(\s*stem\s*\)\s*\)\s*>=\s*10/i);
  assert.ok(s.strings.some((frag) => frag.includes("jsonb_typeof")));
  assert.ok(s.strings.some((frag) => frag.includes("rationale")));
});

test("minimal + require rationale SQL includes required rationale fragment", () => {
  const s = examQuestionDraftPublishableMinimalRequireRationaleSql();
  const joined = s.strings.join("");
  assert.match(joined, /length\s*\(\s*trim\s*\(\s*coalesce\s*\(\s*rationale/i);
  assert.match(joined, />\s*0/);
});

test("strict publish SQL references nclex_client_needs_category", () => {
  const s = examQuestionDraftPublishableStrictSql();
  const blob = s.strings.join("\n");
  assert.match(blob, /nclex_client_needs_category/i);
});

test("bank-sql exports rationale and ECG fragments used by publish gates", () => {
  const bankPath = join(__dirname, "exam-question-bank-sql.ts");
  const src = readFileSync(bankPath, "utf8");
  assert.ok(src.includes("EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL"));
  assert.ok(src.includes("EXAM_QUESTION_NON_ECG_TAG_SQL"));
  assert.ok(src.includes("EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL"));
  assert.ok(src.includes("EXAM_QUESTION_RATIONALE_IF_PRESENT_SQL"));
  assert.ok(src.includes("EXAM_QUESTION_RATIONALE_REQUIRED_SQL"));
});

test("aggregateRowToDiagnostics maps bigint-ish row", () => {
  const row = {
    total_drafts: 3n,
    minimal_eligible: 1n,
    minimal_require_rationale_eligible: 1n,
    strict_eligible: 0n,
    minimal_eligible_empty_rationale: 1n,
    minimal_eligible_short_rationale_5_49: 0n,
    draft_short_stem_lt10: 2n,
    draft_ecg_or_video_format_or_tag: 1n,
    draft_invalid_exam: 0n,
    draft_missing_or_invalid_correct_answer: 1n,
    draft_rationale_too_short_when_present_1_4: 0n,
    draft_missing_topic_or_body: 0n,
  } as DraftPublishAggregateRow;
  const d = aggregateRowToDiagnostics(row);
  assert.equal(d.draftShortStemLt10, 2);
  assert.equal(d.draftEcgOrVideoFormatOrTag, 1);
});

test("dry-run JSON contract: required top-level keys", () => {
  const sample: DraftPublishDryRunJson = {
    mode: "minimal",
    totalDrafts: 10,
    eligibleCount: 2,
    compareEligible: { minimal: 2, minimalRequireRationale: 1, strict: 0 },
    ineligibleReasonCounts: { short_stem: 3 },
    warningCounts: { eligibleEmptyRationale: 1, eligibleShortMinimalRationale: 0 },
    sampleIds: { eligibleEmptyRationale: ["a"], eligibleShortMinimalRationale: [] },
    diagnostics: {
      draftShortStemLt10: 4,
      draftEcgOrVideoFormatOrTag: 0,
      draftInvalidExam: 1,
      draftMissingOrInvalidCorrectAnswer: 2,
      draftRationaleTooShortWhenPresent14: 0,
      draftMissingTopicOrBody: 1,
    },
    wouldUpdateIds: ["a", "b"],
  };
  const parsed = JSON.parse(JSON.stringify(sample)) as Record<string, unknown>;
  assert.equal(parsed.mode, "minimal");
  assert.ok(parsed.ineligibleReasonCounts);
  assert.ok(parsed.warningCounts);
  assert.ok(parsed.sampleIds);
  assert.ok(parsed.diagnostics);
  assert.ok(parsed.compareEligible);
  const w = parsed.warningCounts as Record<string, number>;
  assert.equal(w.eligibleEmptyRationale, 1);
});

test("correct_answer present SQL accepts array and scalar branches", () => {
  const t = EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL.strings.join(" ");
  assert.match(t, /jsonb_typeof/i);
  assert.match(t, /array/i);
});

test("ECG exclusion SQL lists excluded formats", () => {
  const t = EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL.strings.join(" ");
  assert.match(t, /ecg/i);
  assert.match(t, /video/i);
});

test("non-ECG tag SQL references ecg-video", () => {
  assert.ok(EXAM_QUESTION_NON_ECG_TAG_SQL.strings.some((x) => x.includes("ecg-video")));
});

test("rationale optional policy allows empty OR length >= 5", () => {
  const t = EXAM_QUESTION_RATIONALE_IF_PRESENT_SQL.strings.join(" ");
  assert.match(t, /=\s*0/);
  assert.match(t, />=\s*5/);
});

test("rationale required SQL insists on non-empty trimmed rationale", () => {
  assert.ok(EXAM_QUESTION_RATIONALE_REQUIRED_SQL.strings.some((f) => f.includes("rationale")));
});

test("examQuestionTierInSql normalizes stored tier comparisons", () => {
  const sql = examQuestionTierInSql(["RN", "rn", "np"]);
  const text = sql.strings.join("?");
  assert.match(text, /lower\(coalesce\(tier, ''\)\)/i);
  assert.deepEqual(sql.values, ["rn", "np"]);
});
