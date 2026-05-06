import test from "node:test";
import assert from "node:assert/strict";
import {
  flashcardBodySystemsUiOutcomeFromParsed,
  parseFlashcardCustomSessionResponse,
  parseFlashcardInventoryResponse,
} from "@/lib/flashcards/flashcard-custom-session-response";

test("parseFlashcardInventoryResponse: rejects success:true without numeric total (no fake empty pool)", () => {
  const r = parseFlashcardInventoryResponse(true, { success: true, categoryOptions: [] });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.match(r.message, /Invalid inventory/i);
});

test("parseFlashcardInventoryResponse: rejects success:true with non-finite total", () => {
  const r = parseFlashcardInventoryResponse(true, {
    success: true,
    total: Number.NaN,
    categoryOptions: [],
  });
  assert.equal(r.ok, false);
});

test("parseFlashcardInventoryResponse: HTTP error branch wins over confusing success-shaped body", () => {
  const r = parseFlashcardInventoryResponse(false, {
    success: true,
    total: 0,
    categoryOptions: [],
    message: "subscription_required",
  });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.message, "subscription_required");
});

test("parseFlashcardInventoryResponse: maps diagnostics onto summary.poolInventoryDiagnostics", () => {
  const r = parseFlashcardInventoryResponse(true, {
    success: true,
    total: 9110,
    categoryOptions: [{ id: "cardiovascular", title: "CV", count: 100 }],
    categories: [],
    diagnostics: {
      pathwayId: "us-rn-nclex-rn",
      examQuestionSqlPoolCount: 9110,
      dedicatedFlashcardRowCount: 0,
      tier: "RN",
      country: "US",
      poolSource: "flashcard_learner_exam_norm_sql_v1",
      legacyCanonicalPrismaPoolCount: 0,
    },
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.summary?.matchingCards, 9110);
  assert.equal(r.summary?.poolInventoryDiagnostics?.examQuestionSqlPoolCount, 9110);
  assert.equal(r.summary?.poolInventoryDiagnostics?.dedicatedFlashcardRowCount, 0);
  assert.equal(r.summary?.poolInventoryDiagnostics?.pathwayId, "us-rn-nclex-rn");
});

test("parseFlashcardCustomSessionResponse: preserves queryRelaxation on summary", () => {
  const r = parseFlashcardCustomSessionResponse(true, {
    ok: true,
    summary: {
      pathwayId: "us-rn-nclex",
      matchingCards: 2,
      returnedCards: 2,
      selectedCategories: [],
      mode: "mixed",
      queryRelaxation: "dropped_pathway_scope",
      sessionShuffleSalt: "opaque-salt",
    },
    categoryOptions: [{ id: "a", title: "A", count: 1 }],
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.summary?.queryRelaxation, "dropped_pathway_scope");
  assert.equal(r.summary?.sessionShuffleSalt, "opaque-salt");
});

test("parseFlashcardCustomSessionResponse: success with categories", () => {
  const r = parseFlashcardCustomSessionResponse(true, {
    ok: true,
    summary: { pathwayId: "us-rn-nclex", matchingCards: 10, returnedCards: 5, selectedCategories: [], mode: "mixed" },
    categoryOptions: [
      { id: "cardiovascular", title: "Cardiovascular", count: 3 },
      { id: "respiratory", title: "Respiratory", count: 2 },
    ],
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.categoryOptions.length, 2);
  assert.equal(r.categoryOptions[0]!.id, "cardiovascular");
  assert.ok(r.summary);
});

test("parseFlashcardCustomSessionResponse: coerces numeric count strings", () => {
  const r = parseFlashcardCustomSessionResponse(true, {
    ok: true,
    summary: { pathwayId: "ca-rn-nclex-rn", matchingCards: 5, returnedCards: 0, selectedCategories: [], mode: "mixed" },
    categoryOptions: [{ id: "cardiovascular", title: "Cardiovascular", count: "12" as unknown as number }],
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.categoryOptions[0]!.count, 12);
});

test("parseFlashcardCustomSessionResponse: success with zero categories is valid empty", () => {
  const r = parseFlashcardCustomSessionResponse(true, {
    ok: true,
    summary: { pathwayId: "x", matchingCards: 0, returnedCards: 0, selectedCategories: [], mode: "mixed" },
    categoryOptions: [],
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.categoryOptions.length, 0);
});

test("parseFlashcardCustomSessionResponse: HTTP error uses error string", () => {
  const r = parseFlashcardCustomSessionResponse(false, { error: "Subscription required" });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.message, "Subscription required");
});

test("parseFlashcardCustomSessionResponse: non-array categoryOptions is shape error", () => {
  const r = parseFlashcardCustomSessionResponse(true, { ok: true, categoryOptions: {} });
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.equal(r.message, "Invalid response shape");
});

test("parseFlashcardCustomSessionResponse: null body is invalid", () => {
  const r = parseFlashcardCustomSessionResponse(true, null);
  assert.equal(r.ok, false);
});

test("parseFlashcardCustomSessionResponse: skips malformed category rows", () => {
  const r = parseFlashcardCustomSessionResponse(true, {
    ok: true,
    categoryOptions: [{ id: "", title: "x", count: 1 }, { id: "gi", title: "GI", count: 4 }, null, "bad"],
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.categoryOptions.length, 1);
  assert.equal(r.categoryOptions[0]!.id, "gi");
});

test("flashcardBodySystemsUiOutcomeFromParsed: populated vs empty vs error", () => {
  assert.equal(
    flashcardBodySystemsUiOutcomeFromParsed({ ok: true, summary: null, categoryOptions: [{ id: "a", title: "A", count: 1 }] }),
    "populated",
  );
  assert.equal(flashcardBodySystemsUiOutcomeFromParsed({ ok: true, summary: null, categoryOptions: [] }), "empty");
  assert.equal(flashcardBodySystemsUiOutcomeFromParsed({ ok: false, message: "x" }), "error");
});

test("successful empty categoryOptions maps to empty outcome (not ambiguous loading)", () => {
  const ok = parseFlashcardCustomSessionResponse(true, { ok: true, categoryOptions: [], summary: {} });
  assert.equal(ok.ok, true);
  if (!ok.ok) return;
  assert.equal(flashcardBodySystemsUiOutcomeFromParsed(ok), "empty");
});
