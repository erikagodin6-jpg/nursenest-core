import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildReasoningChainNavigation,
  REASONING_CHAIN_EXEMPLARS,
} from "@/lib/breadcrumbs/reasoning-chain-navigation";

test("hyperkalemia reasoning chain is graph-backed with relations", () => {
  const frame = buildReasoningChainNavigation({
    topicSlug: "hyperkalemia",
    topicLabel: "Hyperkalemia",
    pathname: "/app/account/focus-areas/hyperkalemia",
  });
  assert.ok(frame.steps.length >= 1);
  assert.ok(frame.traversal.reasoningChain.length >= 1);
});

test("sepsis reasoning chain depth matches exemplar minimum", () => {
  const frame = buildReasoningChainNavigation({
    topicSlug: "sepsis",
    topicLabel: "Sepsis",
    pathname: "/clinical-interpretation/sepsis-interpretation",
  });
  assert.ok(frame.depth >= REASONING_CHAIN_EXEMPLARS.sepsis.length - 2);
});
