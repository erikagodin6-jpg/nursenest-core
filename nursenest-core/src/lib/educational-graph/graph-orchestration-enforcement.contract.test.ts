import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(thisDir, "..", "..", "..");

function read(rel: string): string {
  return fs.readFileSync(path.join(appRoot, rel), "utf8");
}

const FORBIDDEN_PATTERNS: Array<{ label: string; pattern: RegExp; allowPaths: string[] }> = [
  {
    label: "duplicate TOPIC_INTERPRETATION_SLUG map",
    pattern: /TOPIC_INTERPRETATION_SLUG\s*=\s*\{/,
    allowPaths: ["graph-href-builders.ts"],
  },
  {
    label: "parallel buildRemediationLadder outside adapters",
    pattern: /function buildRemediationLadder(?!V2)/,
    allowPaths: ["remediation-ladder-v2.ts", "graph-orchestration-enforcement.contract.test.ts"],
  },
];

describe("Graph-only orchestration enforcement", () => {
  it("orchestrateEducationalGraph is exported as canonical traversal entry", () => {
    const idx = read("src/lib/educational-graph/index.ts");
    assert.match(idx, /orchestrateEducationalGraph/);
    assert.match(idx, /unified-educational-substrate/);
  });

  it("src must not introduce new interpretation slug maps outside graph-href-builders", () => {
    const hits: string[] = [];
    function walk(dir: string) {
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const rel = path.relative(appRoot, p);
        if (rel.includes("node_modules") || rel.includes(".next")) continue;
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p);
        else if (/\.(ts|tsx)$/.test(name)) {
          const text = fs.readFileSync(p, "utf8");
          for (const rule of FORBIDDEN_PATTERNS) {
            if (rule.allowPaths.some((a) => rel.includes(a))) continue;
            if (rule.pattern.test(text)) hits.push(`${rel}: ${rule.label}`);
          }
        }
      }
    }
    walk(path.join(appRoot, "src/lib"));
    assert.equal(hits.length, 0, hits.join("\n"));
  });

  it("governed telemetry modules forbid raw posthog.capture", () => {
    const files = [
      "src/lib/educational-graph/capture-governed-graph-telemetry.ts",
      "src/components/educational-graph/governed-graph-interaction.tsx",
      "src/components/educational-graph/governed-next-action-link.tsx",
    ];
    for (const rel of files) {
      const text = read(rel);
      assert.doesNotMatch(text, /posthog\.capture\(/, rel);
      assert.match(text, /captureGovernedGraphTelemetry/);
    }
  });

  it("prompt composition exposes graph-ordered tutoring", () => {
    const prompt = read("src/lib/ai-tutor/prompt-composition.ts");
    assert.match(prompt, /composeTutoringPromptFromGraphSteps/);
    assert.match(prompt, /REMEDIATION_GRAPH_ORDER/);
  });

  it("dashboard substrate orchestration consumes buildDashboardGraphActions", () => {
    const dash = read("src/lib/educational-cognition/dashboard-substrate-orchestration.ts");
    assert.match(dash, /buildDashboardGraphActions/);
    assert.match(dash, /resolveUnifiedEducationalSubstrate/);
    assert.doesNotMatch(dash, /buildAdaptiveRecommendations/);
  });
});
