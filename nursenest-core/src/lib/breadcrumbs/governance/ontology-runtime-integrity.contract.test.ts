import assert from "node:assert/strict";
import { test } from "node:test";
import {
  guardOntologyIntegrityForSurface,
  validateOntologyRuntimeIntegrity,
} from "@/lib/breadcrumbs/governance/ontology-runtime-integrity";

test("healthy integrity for governed glossary path", () => {
  const result = validateOntologyRuntimeIntegrity({
    pathname: "/nursing-glossary/hyperkalemia",
    canonicalRootId: "glossary",
    ontologyNamespace: "reference.glossary",
    trailLabels: ["Home", "Glossary", "Hyperkalemia"],
    topicSlug: "hyperkalemia",
  });
  assert.equal(result.tier, "healthy");
});

test("guard does not throw on conflicting namespace", () => {
  const tier = guardOntologyIntegrityForSurface({
    pathname: "/ecg",
    canonicalRootId: "ecg",
    ontologyNamespace: "wrong.namespace",
  });
  assert.equal(tier, "conflicting");
});
