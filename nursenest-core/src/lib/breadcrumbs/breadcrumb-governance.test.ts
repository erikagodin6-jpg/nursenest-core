import assert from "node:assert/strict";
import test from "node:test";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import {
  resolveLearnerBreadcrumbCrumbs,
  resolveLearnerBreadcrumbResolution,
} from "@/lib/breadcrumbs/learner-breadcrumb-resolver";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { auditTopicClusterCrumbs } from "@/lib/breadcrumbs/topic-cluster-governance";
import { hasGeoDepthPollution, validateEducationFirstTrail } from "@/lib/breadcrumbs/navigation-ontology";
import { buildCompetencyNavigationFrame } from "@/lib/breadcrumbs/competency-navigation";
import { buildReasoningChainNavigation } from "@/lib/breadcrumbs/reasoning-chain-navigation";
import {
  learnerFocusAreasHubCrumbs,
  learnerRemediationTrailCrumbs,
  learnerWeakAreaCrumbs,
} from "@/lib/breadcrumbs/learner-navigation";
import { learnerWeakAreaCrumbsFromGraph } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import { buildRemediationNavigationLadder } from "@/lib/breadcrumbs/remediation-navigation";
import {
  auditPageStructuredDataEmissions,
  detectDuplicateBreadcrumbSchema,
  resolveSchemaOwnership,
} from "@/lib/breadcrumbs/structured-data-governance";
import { auditNavigationGovernance } from "@/lib/breadcrumbs/navigation-governance-registry";
import { clinicalInterpretationGuideBreadcrumbs } from "@/lib/breadcrumbs/clinical-interpretation-breadcrumbs";
import { pageOwnsBreadcrumbSchema, shouldEmitLayoutBreadcrumbFallback } from "@/lib/breadcrumbs/schema-ownership";

test("geo pollution detection rejects bad hierarchy", () => {
  assert.equal(
    hasGeoDepthPollution(["Home", "Canada", "RN", "NCLEX", "Medical", "Topic", "Page"]),
    true,
  );
  assert.equal(hasGeoDepthPollution(["Home", "NCLEX-RN", "Lessons", "Sepsis"]), false);
});

test("education-first trail validation", () => {
  const bad = validateEducationFirstTrail({
    intent: "education",
    educationFirst: true,
    nodes: [
      { layer: "site", label: "Home" },
      { layer: "pathway", label: "Canada" },
      { layer: "pathway", label: "RN" },
      { layer: "topic_cluster", label: "Medical" },
      { layer: "lesson", label: "Topic" },
      { layer: "lesson", label: "Page" },
    ],
  });
  assert.equal(bad.ok, false);
});

test("topic cluster audit flags geo pollution", () => {
  const audit = auditTopicClusterCrumbs([
    { name: "Home", href: "/" },
    { name: "Canada", href: "/canada" },
    { name: "RN", href: "/canada/rn" },
    { name: "NCLEX", href: "/canada/rn/nclex-rn" },
    { name: "Medical" },
    { name: "Sepsis" },
  ]);
  assert.equal(audit.ok, false);
  assert.ok(audit.issues.some((i) => i.includes("geo")));
});

test("learner route forbids BreadcrumbList schema ownership", () => {
  assert.equal(resolveSchemaOwnership("/app/lessons/abc", "BreadcrumbList"), "forbidden");
  const examPathway = getExamPathwayById("ca-rn-nclex-rn");
  assert.ok(examPathway);
  const pathway = resolveBreadcrumbResolution({
    kind: "learner-pathway-lesson",
    pathway: examPathway,
    lesson: { slug: "x", title: "T", topic: "sepsis" },
    lessonTitleDisplay: "Lesson",
  });
  assert.equal(pathway.schemaItems.length, 0);
});

test("duplicate schema detection on page-owned routes", () => {
  const dup = detectDuplicateBreadcrumbSchema({
    pathname: "/ecg",
    pageEmitsBreadcrumbList: true,
    layoutEmitsBreadcrumbList: true,
  });
  assert.ok(dup);
  assert.equal(dup?.code, "duplicate_schema");
});

test("clinical interpretation guide breadcrumbs", () => {
  const res = clinicalInterpretationGuideBreadcrumbs({
    category: "acid_base",
    guideTitle: "Respiratory Acidosis",
    guideSlug: "respiratory-acidosis",
  });
  assert.equal(res.intent, "education");
  assert.ok(res.crumbs.some((c) => c.name.includes("Clinical Interpretation")));
  assert.ok(res.schemaItems.length >= 3);
});

test("competency navigation frame for infection topic", () => {
  const frame = buildCompetencyNavigationFrame({ topicSlug: "infection" });
  assert.ok(frame);
  assert.equal(frame?.competencyId, "infection_sepsis");
});

test("remediation ladder builds steps", () => {
  const ladder = buildRemediationNavigationLadder({
    topic: "sepsis",
    pathwayId: "ca-rn-nclex-rn",
  });
  assert.ok(ladder.steps.length >= 1);
});

test("learner remediation trail has no schema", () => {
  const crumbs = learnerRemediationTrailCrumbs({
    weakAreaLabel: "Respiratory weak areas",
    interpretationLabel: "ABG interpretation",
    currentLabel: "Respiratory acidosis",
  });
  assert.equal(crumbs.length, 5);
});

test("governance registry audit", () => {
  const audit = auditNavigationGovernance();
  assert.ok(audit.governed >= 3);
  assert.ok(audit.surfaces.length >= 8);
});

test("layout fallback blocked for owned clinical interpretation path", () => {
  assert.equal(pageOwnsBreadcrumbSchema("/clinical-interpretation/abg"), true);
  assert.equal(shouldEmitLayoutBreadcrumbFallback("/clinical-interpretation"), false);
});

test("ecg hub resolver emits single education intent schema", () => {
  const ecg = resolveBreadcrumbResolution({ kind: "ecg-hub" });
  assert.equal(ecg.intent, "education");
  assert.ok(ecg.schemaItems.length >= 2);
});

test("learner resolver kinds suppress schema", () => {
  const labs = resolveLearnerBreadcrumbResolution({ kind: "labs-hub" });
  assert.equal(labs.intent, "learner");
  assert.equal(labs.schemaItems.length, 0);
  assert.ok(labs.crumbs.length >= 2);
});

test("learner weak-area trail is competency-aware and bounded", () => {
  const crumbs = resolveLearnerBreadcrumbCrumbs({
    kind: "weak-area",
    topicSlug: "hyperkalemia",
    topicLabel: "Hyperkalemia",
    currentLabel: "ECG monitoring",
  });
  assert.ok(crumbs.length <= 6);
  assert.ok(crumbs.length >= 3);
  assert.equal(crumbs[0]?.name, "Home");
  assert.equal(crumbs[crumbs.length - 1]?.name, "ECG monitoring");
});

test("learner weak-area crumbs tolerate missing topicSlug (production digest regression)", () => {
  const crumbs = learnerWeakAreaCrumbs({
    topicSlug: undefined as unknown as string,
    topicLabel: "",
    currentLabel: "Focus areas",
  });
  assert.equal(crumbs[0]?.name, "Home");
  assert.equal(crumbs[crumbs.length - 1]?.name, "Focus areas");
  assert.ok(crumbs.every((c) => typeof c.name === "string" && c.name.length > 0));
});

test("learner focus-areas hub crumbs tolerate null primary topic", () => {
  const crumbs = learnerFocusAreasHubCrumbs({
    primaryTopicSlug: null,
    primaryTopicLabel: null,
  });
  assert.equal(crumbs[0]?.name, "Home");
  assert.equal(crumbs[crumbs.length - 1]?.name, "Focus areas");
});

test("reasoning chain navigation tolerates missing topicSlug (production digest regression)", () => {
  const frame = buildReasoningChainNavigation({
    topicSlug: undefined as unknown as string,
    topicLabel: "",
    pathname: "/pricing",
  });
  assert.equal(frame.topicSlug, "focus-areas");
  assert.ok(Array.isArray(frame.steps));
});

test("structured data audit catches duplicate FAQ on owned ECG route", () => {
  const issues = auditPageStructuredDataEmissions("/ecg", { FAQPage: true, BreadcrumbList: true }, true);
  assert.ok(issues.some((i) => i.code === "duplicate_schema" || i.code === "duplicate_faq"));
});

test("graph convergence produces remediation pathway id", () => {
  const result = learnerWeakAreaCrumbsFromGraph({
    topicSlug: "sepsis",
    topicLabel: "Sepsis",
    pathwayId: "ca-rn-nclex-rn",
    sourceSurface: "app_remediation",
    currentLabel: "Prioritization drill",
  });
  assert.ok(result.remediationPathwayId.includes("sepsis"));
  assert.ok(result.crumbs.length >= 3);
});

test("remediation navigation uses graph orchestration", () => {
  const ladder = buildRemediationNavigationLadder({
    topic: "infection",
    pathwayId: null,
    sourceSurface: "post_exam_coaching",
  });
  assert.ok(ladder.remediationPathwayId);
  assert.ok(ladder.steps.length >= 1);
  assert.equal(ladder.steps.filter((s, i, arr) => arr.findIndex((x) => x.href === s.href) !== i).length, 0);
});
