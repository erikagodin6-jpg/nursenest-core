import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { ECG_CLUSTER_TOPICS } from "@/lib/ecg-module/ecg-seo-cluster";
import {
  buildEcgModuleHubLinkCandidate,
  CLINICAL_MODULES_HUB_PATH,
  ECG_ECOSYSTEM_SUBPAGE_PATHS,
  ECG_PILLAR_MARKETING_PATH,
  lessonSignalsEcgLinkedLearning,
  pathwayAllowsEcgLinkedLearning,
  resolveEcgEcosystemTargetPath,
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
  // href resolves to the most relevant ECG ecosystem sub-page or the pillar
  assert.ok(
    isKnownEcgRecommendationHref(ok!.href),
    `Expected href to be a known ECG recommendation route, got: ${ok!.href}`,
  );

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

test("resolveEcgEcosystemTargetPath routes to correct sub-page by topic signal", () => {
  const make = (title: string, topic = "cardiac", topicSlug = "", bodySystem = "cardiovascular") => ({
    slug: "test",
    title,
    topic,
    topicSlug,
    bodySystem,
  });

  // STEMI signals → existing STEMI localization cluster page
  assert.equal(
    resolveEcgEcosystemTargetPath(make("STEMI recognition and localization")),
    "/ecg/stemi-localization",
  );
  // ACLS signals → existing ventricular tachycardia / ACLS cluster page
  assert.equal(
    resolveEcgEcosystemTargetPath(make("Cardiac arrest and ACLS rhythms")),
    "/ecg/ventricular-tachycardia",
  );
  // Electrolyte signals → existing hyperkalemia ECG cluster page
  assert.equal(
    resolveEcgEcosystemTargetPath(make("Hyperkalemia ECG changes in renal failure")),
    "/ecg/hyperkalemia-ecg-changes",
  );
  // ICU/critical care → existing ventricular tachycardia cluster page
  assert.equal(
    resolveEcgEcosystemTargetPath(make("Bundle branch block in ICU monitoring")),
    "/ecg/ventricular-tachycardia",
  );
  // Telemetry → existing ECG practice questions cluster page
  assert.equal(
    resolveEcgEcosystemTargetPath(make("Alarm fatigue in telemetry monitoring")),
    "/ecg/ecg-practice-questions",
  );
  // Generic cardiac → pillar fallback
  assert.equal(
    resolveEcgEcosystemTargetPath(make("Cardiac output and hemodynamics")),
    ECG_PILLAR_MARKETING_PATH,
  );
});

const knownEcgTopicHrefs = new Set(ECG_CLUSTER_TOPICS.map((topic) => `/ecg/${topic.slug}`));

function isKnownEcgRecommendationHref(href: string): boolean {
  return href === ECG_PILLAR_MARKETING_PATH || href === CLINICAL_MODULES_HUB_PATH || knownEcgTopicHrefs.has(href);
}

test("ECG ecosystem target constants point only at live recommendation routes", () => {
  for (const [key, href] of Object.entries(ECG_ECOSYSTEM_SUBPAGE_PATHS)) {
    assert.ok(isKnownEcgRecommendationHref(href), `${key} points at a missing route: ${href}`);
  }
});

test("generated ECG recommendation hrefs never use missing Advanced ECG deep links", () => {
  const rn = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(rn);

  const topicSignals = [
    "Rhythm practice for atrial fibrillation",
    "STEMI recognition and localization",
    "Hyperkalemia ECG changes in renal failure",
    "Medication-induced QT prolongation",
    "Bundle branch block in ICU monitoring",
    "Pediatric SVT and congenital rhythm concerns",
    "Alarm fatigue in telemetry monitoring",
    "ECG case simulation for chest pain",
    "Cardiac arrest and ACLS rhythms",
  ];

  for (const title of topicSignals) {
    const candidate = buildEcgModuleHubLinkCandidate({
      pathway: rn,
      locale: "en",
      lesson: {
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title,
        topic: "cardiac",
        topicSlug: "cardiac-ecg",
        bodySystem: "cardiovascular",
      },
    });

    assert.ok(candidate, `Expected ECG candidate for ${title}`);
    assert.ok(isKnownEcgRecommendationHref(candidate.href), `Generated missing route href: ${candidate.href}`);
    assert.ok(
      !candidate.href.startsWith(`${ECG_PILLAR_MARKETING_PATH}/`),
      `Generated Advanced ECG deep link that may 404: ${candidate.href}`,
    );
  }
});
