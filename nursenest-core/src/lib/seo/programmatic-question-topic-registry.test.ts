import assert from "node:assert/strict";
import test from "node:test";
import {
  getAllProgrammaticQuestionTopicSlugs,
  getProgrammaticQuestionTopicDefinition,
} from "@/lib/seo/programmatic-question-topic-registry";

test("programmatic question topic slugs include requested landing pages", () => {
  const slugs = new Set(getAllProgrammaticQuestionTopicSlugs());
  assert.ok(slugs.has("heart-failure-nclex"));
  assert.ok(slugs.has("infection-control-nursing"));
  assert.ok(slugs.has("dha-exam-practice"));
});

test("each registry row has SSR copy, FAQ, and pathway scope", async () => {
  for (const slug of getAllProgrammaticQuestionTopicSlugs()) {
    const p = await getProgrammaticQuestionTopicDefinition(slug);
    assert.ok(p, slug);
    const words = p!.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 150 && words <= 320, `${slug}: intro target 150–300 words`);
    assert.ok(p!.faq.length >= 2, slug);
    assert.ok(p!.primaryPathwayId.length > 0, slug);
    assert.ok(p!.hubPathwayIds.length > 0, slug);
  }
});
