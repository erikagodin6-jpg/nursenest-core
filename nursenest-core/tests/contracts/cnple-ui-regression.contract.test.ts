import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const sim = readFileSync(join(root, "src/components/exam/cnple-sim-shell.tsx"), "utf-8");
const cases = readFileSync(join(root, "src/components/cases/cnple-longitudinal-case-shell.tsx"), "utf-8");

function has(source: string, text: string) {
  assert.ok(source.includes(text), `Missing expected UI contract text: ${text}`);
}

function lacks(source: string, text: string) {
  assert.ok(!source.includes(text), `Unexpected legacy UI contract text: ${text}`);
}

describe("CNPLE UI regression smoke guards", () => {
  it("both CNPLE exam surfaces expose the shared learner exam stack marker", () => {
    has(sim, "data-learner-exam-stack");
    has(cases, "data-learner-exam-stack");
    has(sim, "cnple-loft");
    has(cases, "cnple-loft");
  });

  it("CNPLE answer options use CAT-style stable state markers", () => {
    has(sim, "data-cnple-answer-option");
    has(cases, "data-cnple-answer-option");
    has(sim, "data-state");
    has(cases, "data-state");
    has(sim, "borderWidth");
    has(cases, "borderWidth");
    has(sim, "1.5px");
    has(cases, "1.5px");
    has(sim, "inset 4px 0 0");
    has(cases, "inset 4px 0 0");
  });

  it("CNPLE answer options avoid old motion and circular badge styling", () => {
    has(sim, "rounded-[5px]");
    has(cases, "rounded-[5px]");
    lacks(sim, "transition-all");
    lacks(cases, "transition-[border-color,background]");
    lacks(cases, "rounded-full border text-[11px] font-bold");
  });

  it("CNPLE shell surfaces stay clinically quiet", () => {
    has(sim, "var(--semantic-surface)");
    has(cases, "var(--semantic-surface)");
    lacks(sim, "semantic-info) 22%");
    lacks(sim, "semantic-info) 20%");
  });
});
