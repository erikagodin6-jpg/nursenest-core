import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildContentQualityDashboard,
  buildExpertReviewQueue,
  evaluateClinicalContentQuality,
  evaluateClinicalPublicationGate,
  findNearDuplicateClinicalContent,
  type ClinicalContentQualityInput,
} from "./clinical-content-validator";

const strongQuestion: ClinicalContentQualityInput = {
  id: "q-safe-potassium",
  contentType: "question",
  title: "Hyperkalemia escalation",
  stem:
    "A client with chronic kidney disease has a potassium of 6.4 mmol/L, new peaked T waves on ECG, and reports muscle weakness. Which action should the nurse prioritize first?",
  hint:
    "Identify the cue that creates the greatest immediate circulation risk before considering routine teaching or delayed reassessment.",
  rationale:
    "Peaked T waves with severe hyperkalemia indicate an immediate risk for dangerous dysrhythmia because potassium changes alter myocardial conduction. The nurse should prioritize rapid escalation, continuous cardiac monitoring, and ordered emergency treatment rather than routine dietary teaching. Waiting can allow deterioration to ventricular dysrhythmias or cardiac arrest.",
  whyCorrect:
    "The correct action addresses the ECG change and critical potassium value, which are time-sensitive circulation threats. Escalating now protects perfusion and allows emergency therapies to begin within scope and protocol.",
  whyIncorrect: [
    "Diet teaching matters later but does not treat the immediate dysrhythmia risk.",
    "Repeating the lab without monitoring may delay care when ECG changes already show instability.",
    "Documenting the value alone does not protect the client from cardiac deterioration.",
  ],
  clinicalApplication:
    "At the bedside, nurses trend potassium with ECG findings, renal status, weakness, medication profile, and telemetry changes so escalation occurs before collapse rather than after symptoms become dramatic.",
  clinicalPearl:
    "ECG changes make hyperkalemia a circulation emergency; treat the rhythm risk, not the lab number in isolation.",
  examStrategy:
    "NCLEX and NGN priority stems reward the option that responds to unstable circulation before routine teaching, documentation, or nonurgent reassessment.",
  relatedLessonIds: ["hyperkalemia-ecg-safety"],
  relatedFlashcardIds: ["fc-hyperkalemia-peaked-t"],
  references: ["AHA emergency cardiovascular care guidance", "KDIGO kidney disease guidance"],
  clinicalAccuracyReviewed: true,
  lastReviewedAt: new Date().toISOString(),
};

describe("clinical content validator", () => {
  it("blocks placeholder and circular question rationales", () => {
    const weak = evaluateClinicalContentQuality({
      id: "weak-question",
      contentType: "question",
      stem: "What is heart failure?",
      hint: "The answer is option B.",
      rationale: "Correct because it is correct. TODO: expand later.",
      whyCorrect: "Because it is right.",
      whyIncorrect: "Not correct.",
      clinicalPearl: "Heart failure can cause fluid retention.",
      clinicalApplication: "",
      examStrategy: "",
    });

    assert.equal(weak.publicationReady, false);
    assert.equal(weak.band, "Do Not Publish");
    assert.ok(weak.issues.some((issue) => issue.code === "PLACEHOLDER_CONTENT"));
    assert.ok(weak.issues.some((issue) => issue.code === "WEAK_RATIONALE"));
  });

  it("passes a clinically specific question with rationale, hint, pearl, and application", () => {
    const result = evaluateClinicalContentQuality(strongQuestion);
    const gate = evaluateClinicalPublicationGate(strongQuestion);

    assert.equal(result.publicationReady, true, result.issues.map((issue) => issue.message).join("; "));
    assert.ok(result.score >= 85);
    assert.equal(gate.ok, true, gate.reasons.join("; "));
  });

  it("routes high-risk unreviewed pharmacology content to expert review and blocks publish", () => {
    const result = evaluateClinicalPublicationGate({
      id: "np-dose",
      contentType: "np_module",
      title: "Pediatric insulin titration",
      body:
        "This module discusses pediatric insulin dosing, titration, contraindications, hypoglycemia risk, and prescribing follow-up for advanced practice learners.",
      references: [],
      clinicalAccuracyReviewed: false,
    });

    assert.equal(result.ok, false);
    assert.equal(result.reviewRequired, true);
    assert.ok(result.reasons.some((reason) => /Clinical Accuracy Pass|required|High-risk/i.test(reason)));
  });

  it("detects near-duplicate clinical content", () => {
    const duplicates = findNearDuplicateClinicalContent([
      {
        id: "left",
        contentType: "clinical_pearl",
        clinicalPearl:
          "Daily weights often detect worsening heart failure before symptoms become obvious, because fluid retention can appear before dyspnea or edema is reported.",
      },
      {
        id: "right",
        contentType: "clinical_pearl",
        clinicalPearl:
          "Daily weights can detect worsening heart failure before obvious symptoms because fluid retention may appear before dyspnea or edema is reported.",
      },
    ], 0.6);

    assert.equal(duplicates.length, 1);
    assert.equal(duplicates[0]?.leftId, "left");
  });

  it("summarizes dashboard and expert review backlog", () => {
    const items = [
      strongQuestion,
      {
        id: "weak-flashcard",
        contentType: "flashcard",
        front: "Heart failure?",
        back: "Fluid retention.",
        clinicalPearl: "Heart failure can cause fluid retention.",
      } satisfies ClinicalContentQualityInput,
    ];

    const dashboard = buildContentQualityDashboard(items);
    const queue = buildExpertReviewQueue(items);

    assert.equal(dashboard.totalItems, 2);
    assert.ok(dashboard.publicationReady >= 1);
    assert.ok(queue.some((item) => item.id === "weak-flashcard"));
  });
});
