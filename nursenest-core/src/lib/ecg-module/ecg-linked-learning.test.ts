import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  buildEcgModuleHubLinkCandidate,
  lessonSignalsEcgLinkedLearning,
  pathwayAllowsEcgLinkedLearning,
} from "@/lib/ecg-module/ecg-linked-learning";

test("pathwayAllowsEcgLinkedLearning: RN/NP yes; REx-PN, PN, and New Grad no", () => {
  const rn = getExamPathwayById("us-rn-nclex-rn");
  const np = getExamPathwayById("us-np-fnp");
  const rex = getExamPathwayById("ca-rpn-rex-pn");
  const pn = getExamPathwayById("us-lpn-nclex-pn");
  const newGrad = getExamPathwayById("us-rn-new-grad-transition");
  assert.ok(rn && np && rex && pn && newGrad);
  assert.equal(pathwayAllowsEcgLinkedLearning(rn), true);
  assert.equal(pathwayAllowsEcgLinkedLearning(np), true);
  assert.equal(pathwayAllowsEcgLinkedLearning(rex), false);
  assert.equal(pathwayAllowsEcgLinkedLearning(pn), false);
  assert.equal(pathwayAllowsEcgLinkedLearning(newGrad), false);
});

test("lessonSignalsEcgLinkedLearning detects cardiac + ECG terminology", () => {
  assert.equal(
    lessonSignalsEcgLinkedLearning({
      slug: "x",
      title: "Fluid balance",
      topic: "renal",
      topicSlug: "renal",
      bodySystem: "renal",
    }),
    false,
  );
  assert.equal(
    lessonSignalsEcgLinkedLearning({
      slug: "x",
      title: "STEMI recognition on telemetry",
      topic: "cardiac",
      topicSlug: "acute-coronary",
      bodySystem: "cardiovascular",
    }),
    true,
  );
});

test("buildEcgModuleHubLinkCandidate returns hub link only for entitled pathways + cardiac signals", () => {
  const rn = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(rn);
  const pn = getExamPathwayById("us-lpn-nclex-pn");
  assert.ok(pn);

  const ok = buildEcgModuleHubLinkCandidate({
    pathway: rn,
    locale: "en",
    lesson: {
      slug: "ecg-review",
      title: "ECG interpretation basics",
      topic: "cardiac",
      topicSlug: "cardiac-ecg",
      bodySystem: "cardiovascular",
    },
  });
  assert.ok(ok);
  assert.equal(ok!.kind, "hub");
  assert.equal(ok!.href, "/modules/ecg/basic/lessons");

  const blockedPn = buildEcgModuleHubLinkCandidate({
    pathway: pn,
    locale: "en",
    lesson: {
      slug: "ecg-review",
      title: "ECG interpretation basics",
      topic: "cardiac",
      topicSlug: "cardiac-ecg",
      bodySystem: "cardiovascular",
    },
  });
  assert.equal(blockedPn, null);
});
