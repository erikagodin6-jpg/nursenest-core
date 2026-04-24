import assert from "node:assert/strict";
import test from "node:test";

import {
  PATHO_PHARM_LONGTAIL_TOPIC_REGISTRY_MIN,
  PATHO_PHARM_TOPIC_REGISTRY,
  getPathoPharmLongtailTopicRegistry,
  normalizeTopicKey,
} from "./patho-pharm-longtail-topic-registry";
import { semanticMechanismDuplicateKey, validateClinicalTopicCoherence } from "./patho-pharm-longtail-topic-coherence";
import { titleMatchesStrictSearchPattern } from "./patho-pharm-longtail-topic-patterns";

import { enumerateLongTailTopics } from "../../../scripts/blog/lib/patho-pharm-longtail-post-builder";

test("PATHO_PHARM_TOPIC_REGISTRY meets minimum size and public row shape", () => {
  assert.ok(PATHO_PHARM_TOPIC_REGISTRY.length >= PATHO_PHARM_LONGTAIL_TOPIC_REGISTRY_MIN);
  for (const row of PATHO_PHARM_TOPIC_REGISTRY.slice(0, 5)) {
    assert.match(row.id, /^pph-\d{5}$/);
    assert.ok(row.title.length >= 24);
    assert.ok(row.slug.startsWith("lt-reg-"));
    assert.ok(row.keywords.length > 0);
    assert.ok(typeof row.patternId === "number");
  }
});

test("first 50 enumerated topics pass strict coherence and search-style patterns", () => {
  const topics = enumerateLongTailTopics(50);
  assert.equal(topics.length, 50);
  const normKeys = new Set<string>();
  const semKeys = new Set<string>();
  for (const topic of topics) {
    assert.equal(topic.topicSource, "registry");
    assert.ok(titleMatchesStrictSearchPattern(topic.title));
    const coh = validateClinicalTopicCoherence({
      title: topic.title,
      slug: topic.slug,
      topicSource: "registry",
      relationshipType: topic.relationshipType,
    });
    assert.equal(coh.ok, true, coh.reason ?? "expected ok");
    const nk = normalizeTopicKey(topic.title);
    assert.ok(!normKeys.has(nk), `duplicate normalizeTopicKey: ${topic.title}`);
    normKeys.add(nk);
    const sk = semanticMechanismDuplicateKey(topic.title);
    assert.ok(!semKeys.has(sk), `duplicate semanticMechanismDuplicateKey: ${topic.title} -> ${sk}`);
    semKeys.add(sk);
  }
});

test("getPathoPharmLongtailTopicRegistry length matches PATHO_PHARM_TOPIC_REGISTRY", () => {
  assert.equal(getPathoPharmLongtailTopicRegistry().length, PATHO_PHARM_TOPIC_REGISTRY.length);
});

test("validateClinicalTopicCoherence rejects non-allowlisted synthetic titles", () => {
  const bad = validateClinicalTopicCoherence({
    title: "Why does sepsis cause confusion?",
    slug: "x",
    topicSource: "synthetic",
    relationshipType: "condition_symptom",
  });
  assert.equal(bad.ok, false);
  assert.ok(bad.reason);
});

test("validateClinicalTopicCoherence rejects versus-style mashups", () => {
  const bad = validateClinicalTopicCoherence({
    title: "Why does DKA vs HHS cause different potassium shifts?",
    slug: "x",
    topicSource: "synthetic",
    relationshipType: "condition_symptom",
  });
  assert.equal(bad.ok, false);
  assert.equal(bad.reason, "title_multi_mechanism_comparison");
});
