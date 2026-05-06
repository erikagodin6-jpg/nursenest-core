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

import { maxPairwiseH2SectionJaccard } from "./blog-content-quality-gate";
import { validateBlogPublishQuality } from "./blog-publish-quality-validator";
import {
  buildApaReferences,
  buildFaq,
  buildLongTailBody,
  enumerateLongTailTopics,
  tagsForTopic,
} from "../../../scripts/blog/lib/patho-pharm-longtail-post-builder";

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

test("patho-pharm long-tail builder avoids banned filler and passes publish-quality + low H2 overlap", () => {
  const topic = enumerateLongTailTopics(1)[0];
  const links = '<a href="/blog/a">A</a> <a href="/blog/b">B</a> <a href="/blog/c">C</a>';
  const body = buildLongTailBody(topic, links);
  const lower = body.toLowerCase();
  assert.ok(!lower.includes("this section connects"));
  assert.ok(!lower.includes("(deeper)"));
  assert.ok(!lower.includes("(application)"));
  assert.ok(maxPairwiseH2SectionJaccard(body) < 0.45, `expected low H2 overlap, got ${maxPairwiseH2SectionJaccard(body)}`);
  const faq = buildFaq(topic);
  const apa = buildApaReferences(topic, "May 6, 2026");
  const pq = validateBlogPublishQuality({
    title: topic.title,
    body,
    targetKeyword: topic.targetKeyword,
    category: topic.category,
    tags: tagsForTopic(topic),
    faqBlock: {
      items: [
        { q: faq.q1, a: faq.a1 },
        { q: faq.q2, a: faq.a2 },
        { q: faq.q3, a: faq.a3 },
      ],
    },
    apaReferences: apa,
    sourcesJson: { families: ["CDC", "MedlinePlus"], retrieved: new Date().toISOString() },
  });
  assert.equal(pq.ok, true, pq.blocking.map((b) => b.message).join("; "));
});
