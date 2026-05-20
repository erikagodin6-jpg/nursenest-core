import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { auditGraphTraversal } from "@/lib/educational-graph/graph-governance";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { toCompetencyGraphSteps } from "@/lib/educational-graph/graph-step-adapters";
import { buildRemediationNavigationLadder } from "@/lib/breadcrumbs/remediation-navigation";
import { detectRemediationLoops } from "@/lib/educational-graph/graph-governance";
import { maxGraphStepsForSurface } from "@/lib/educational-graph/graph-surface-caps";
import { buildRnRemediationGraphSteps } from "@/lib/learner/rn-coaching-intelligence/competency-graph-orchestration";
import { planRemediationV3 } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(thisDir, "..", "..");

describe("Educational graph orchestrator — third pass", () => {
  it("marketing and app surfaces share canonical hrefs for sepsis", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const marketing = orchestrateEducationalGraph({
      topicSlug: "sepsis",
      topicLabel: "Sepsis",
      marketingPathway: pathway,
      anchorLessonSlug: "sepsis-1",
      sourceSurface: "marketing_lesson",
    });
    const app = orchestrateEducationalGraph({
      topicSlug: "sepsis",
      pathwayId: pathway.id,
      coachingModel: "cat_adaptive",
      sourceSurface: "app_remediation",
    });
    const marketingInterpret = marketing.steps.find((s) => s.stepKind === "interpretation");
    const appInterpret = app.steps.find((s) => s.stepKind === "interpretation");
    if (marketingInterpret && appInterpret) {
      assert.equal(marketingInterpret.href, appInterpret.href);
    }
  });

  it("learner state reorders interpretation ahead of reassessment when measurement weak", () => {
    const state = {
      ...EMPTY_LEARNER_STATE("us-rn-nclex-rn"),
      measurementWeaknesses: ["potassium_trend"],
      competencyStates: [
        {
          competencyId: "fluid_electrolyte_balance" as const,
          masteryScore: 35,
          volatility: "declining" as const,
          sessionEvidenceCount: 4,
          persistentWeak: true,
          remediationResponsive: null,
          lastUpdatedAt: new Date().toISOString(),
        },
      ],
    };
    const traversal = orchestrateEducationalGraph({
      topicSlug: "hyperkalemia",
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "dashboard_feed",
      learnerState: state,
      persistentWeakTopics: ["hyperkalemia"],
    });
    const interpretIdx = traversal.steps.findIndex((s) => s.stepKind === "interpretation");
    const reassessIdx = traversal.steps.findIndex((s) => s.stepKind === "reassessment" || s.stepKind === "cat_exam");
    if (interpretIdx >= 0 && reassessIdx >= 0) {
      assert.ok(interpretIdx < reassessIdx);
    }
  });

  it("buildRnRemediationGraphSteps delegates to orchestrator with stepId contract", () => {
    const legacy = buildRnRemediationGraphSteps({
      topic: "sepsis",
      pathwayId: "us-rn-nclex-rn",
      coachingModel: "cat_adaptive",
      exposureDepth: 0,
    });
    const mapped = toCompetencyGraphSteps(
      orchestrateEducationalGraph({
        topicSlug: "sepsis",
        pathwayId: "us-rn-nclex-rn",
        coachingModel: "cat_adaptive",
        exposureDepth: 0,
        sourceSurface: "app_remediation",
      }).steps,
    );
    assert.equal(legacy.length, mapped.length);
    assert.ok(legacy.every((s) => s.href.startsWith("/")));
  });

  it("graph traversal passes governance audit", () => {
    const traversal = orchestrateEducationalGraph({
      topicSlug: "diabetic-ketoacidosis",
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "post_exam_coaching",
      coachingModel: "cat_adaptive",
    });
    const issues = auditGraphTraversal(traversal.steps);
    assert.equal(issues.filter((i) => i.code === "duplicate_href").length, 0);
    assert.ok(traversal.steps.length <= 8);
  });

  it("planRemediationV3 uses orchestrator-backed hrefs with dashboard cap", () => {
    const recs = planRemediationV3({
      coachingModel: "cat_adaptive",
      sessionKind: "practice_exam",
      pathwayId: "us-rn-nclex-rn",
      weakTopicLabels: ["sepsis"],
      maxItems: 5,
      sourceSurface: "dashboard_feed",
    });
    assert.ok(recs.length >= 1);
    assert.ok(recs.length <= maxGraphStepsForSurface("dashboard_feed", { explicitMax: 5 }));
    assert.ok(recs.every((r) => r.href.startsWith("/")));
    assert.ok(recs.every((r) => r.graphStep));
  });

  it("remediation navigation ladder matches orchestrator step count", () => {
    const ladder = buildRemediationNavigationLadder({
      topic: "sepsis",
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "study_plan",
    });
    const traversal = orchestrateEducationalGraph({
      topicSlug: "sepsis",
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "study_plan",
    });
    assert.equal(ladder.steps.length, traversal.steps.length);
    assert.equal(detectRemediationLoops(traversal.steps.map((s) => ({ href: s.href, stepKind: s.stepKind, competencyId: s.competencyId }))).length, 0);
  });

  it("remediation-planner-v3 calls orchestrator not buildRnRemediationGraphSteps", () => {
    const planner = fs.readFileSync(
      path.join(repoRoot, "lib/learner/rn-coaching-intelligence/remediation-planner-v3.ts"),
      "utf8",
    );
    assert.match(planner, /orchestrateEducationalGraph/);
    assert.doesNotMatch(planner, /buildRnRemediationGraphSteps/);
  });

  it("competency-graph-orchestration is thin wrapper (no duplicate interpretation map)", () => {
    const src = fs.readFileSync(
      path.join(repoRoot, "lib/learner/rn-coaching-intelligence/competency-graph-orchestration.ts"),
      "utf8",
    );
    assert.doesNotMatch(src, /TOPIC_INTERPRETATION_SLUG/);
    assert.match(src, /orchestrateEducationalGraph/);
  });
});

describe("Canada RPN canonical guard", () => {
  const allowlist = [
    "next.config.mjs",
    "canada/rpn/rex-pn/",
    "rpn-route-aliases.contract.test.ts",
    "educational-graph-orchestrator.contract.test.ts",
    "audit-rn-educational-graph.mjs",
    "seo-graph-hardening.contract.test.ts",
  ];

  it("src must not introduce new /canada/rpn/rex-pn product hrefs outside allowlist", () => {
    const hits: string[] = [];
    function walk(dir: string) {
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const rel = path.relative(repoRoot, p);
        if (allowlist.some((a) => rel.includes(a))) continue;
        const st = fs.statSync(p);
        if (st.isDirectory()) {
          if (name === "node_modules" || name === ".next") continue;
          walk(p);
        } else if (/\.(ts|tsx|mjs|js)$/.test(name)) {
          const text = fs.readFileSync(p, "utf8");
          if (text.includes("/canada/rpn/rex-pn")) hits.push(rel);
        }
      }
    }
    walk(repoRoot);
    assert.equal(
      hits.length,
      0,
      `Legacy RPN hrefs remain:\n${hits.slice(0, 12).join("\n")}${hits.length > 12 ? `\n...+${hits.length - 12}` : ""}`,
    );
  });
});
