import assert from "node:assert/strict";
import test from "node:test";

import { questionBankBulkItemSchema } from "@/lib/admin/question-bank-bulk-import";
import { bowtieStarterBatchItems } from "./bowtie-starter-batch-data";

test("bowtie starter batch has requested counts by tier", () => {
  const byTier = bowtieStarterBatchItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.tier] = (acc[item.tier] ?? 0) + 1;
    return acc;
  }, {});
  assert.deepEqual(byTier, {
    RPN: 75,
    LVN_LPN: 75,
    NP: 75,
    NEW_GRAD: 50,
    ALLIED: 32,
    PRE_NURSING: 20,
  });
});

test("bowtie starter batch validates and keeps each system below concentration cap", () => {
  for (const item of bowtieStarterBatchItems) {
    assert.equal(questionBankBulkItemSchema.safeParse(item).success, true, item.stem);
  }

  const byTierSystem = bowtieStarterBatchItems.reduce<Record<string, Record<string, number>>>((acc, item) => {
    acc[item.tier] ??= {};
    acc[item.tier][item.bodySystem] = (acc[item.tier][item.bodySystem] ?? 0) + 1;
    return acc;
  }, {});

  for (const [tier, systems] of Object.entries(byTierSystem)) {
    const total = Object.values(systems).reduce((sum, count) => sum + count, 0);
    const maxShare = Math.max(...Object.values(systems).map((count) => count / total));
    assert.ok(maxShare <= 0.25, `${tier} max system share ${maxShare}`);
  }
});

test("allied starter rows carry profession scope and avoid nursing role wording", () => {
  const allied = bowtieStarterBatchItems.filter((item) => item.tier === "ALLIED");
  assert.ok(allied.length > 0);
  for (const item of allied) {
    assert.equal(item.professionScope, "respiratory-paramedic-mlt-pta");
    const corpus = `${item.stem} ${item.scenario} ${item.rationale} ${item.bank.map((entry) => entry.label).join(" ")}`;
    assert.doesNotMatch(corpus, /\bnurse\b|\bnursing\b/i);
  }
});
