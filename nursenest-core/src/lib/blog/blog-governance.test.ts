import assert from "node:assert/strict";
import test from "node:test";
import {
  BLOG_GOVERNANCE_MIN_PUBLISH_SCORE,
  BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW,
  detectGovernancePlaceholderSignals,
  detectGovernanceRepetitionSignals,
  governancePublishBlockingReasons,
  scoreBlogArticleForGovernance,
} from "@/lib/blog/blog-quality-score";

/** Single pass of headings + links; repeat only unique paragraphs (not duplicate H2 trees). */
const goodBody = `
<h2>Pathophysiology</h2><p>Mechanism and hemodynamic changes for the topic (National Council of State Boards of Nursing, 2023).</p>
<h2>Assessment</h2><p>Signs and nursing surveillance priorities (Centers for Disease Control and Prevention, 2024).</p>
<h2>Interventions</h2><p>Prioritized nursing actions and escalation (American Nurses Association, 2021).</p>
<p><a href="/questions">Practice questions</a>, <a href="/flashcards">flashcards</a>, and <a href="/practice-exams">practice exams</a> support NCLEX study strategy.</p>
`;

function buildGovernanceStrongBodyHtml(): string {
  let html = goodBody;
  const cues = ["airway", "perfusion", "infection control", "fluid balance", "glycemic shifts", "pain control", "mobility", "skin integrity", "med reconciliation", "fall risk", "delirium screening", "DVT prevention", "nutrition", "discharge teaching", "family communication", "code status clarity", "lab trend interpretation", "escalation thresholds", "handoff safety"];
  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i] ?? `priority-${i}`;
    html += `<p>Section ${i + 1} anchors NCLEX study strategy to ${cue}, linking assessment data to interventions and teaching (National Council of State Boards of Nursing, 2023).</p>`;
  }
  return html;
}

test("detectGovernancePlaceholderSignals finds banned filler", () => {
  const s = detectGovernancePlaceholderSignals("<p>this section connects the clinical question to safe nursing action</p>");
  assert.ok(s.some((x) => x.includes("banned_filler")));
});

test("detectGovernanceRepetitionSignals flags duplicate paragraphs", () => {
  const p = "<p>" + "Same paragraph text repeated for test governance. ".repeat(8) + "</p>";
  const html = `${p}${p}<h2>Section</h2><p>Unique content about nursing assessment and labs.</p>`;
  const r = detectGovernanceRepetitionSignals(html);
  assert.ok(r.signals.some((x) => x.startsWith("duplicate_paragraph")));
});

test("scoreBlogArticleForGovernance: strong article recommends publish", () => {
  const g = scoreBlogArticleForGovernance({
    title: "NCLEX study strategy with structured practice",
    bodyHtml: buildGovernanceStrongBodyHtml(),
    slug: "nclex-study-strategy",
    seoTitle: "NCLEX study strategy with structured practice",
    seoDescription:
      "A detailed NCLEX study-strategy article covering question review, internal links, and source-backed learning habits for exam preparation.",
    targetKeyword: "nclex study strategy",
    category: "Exam strategy",
    tags: ["nclex"],
    faqBlock: {
      items: [
        { q: "How should I review NCLEX questions?", a: "Use rationales to name missed cues and connect to nursing priorities for spaced NCLEX review." },
        { q: "Which links help?", a: "Use lessons, flashcards, and practice exams aligned to NCLEX study strategy." },
      ],
    },
    apaReferences: [],
    plannedInternalLinkRows: 4,
  });
  assert.ok(g.compositeScore >= BLOG_GOVERNANCE_MIN_PUBLISH_SCORE);
  assert.equal(g.publishRecommendation, "publish");
  assert.equal(governancePublishBlockingReasons(g).length, 0);
});

test("scoreBlogArticleForGovernance: placeholder blocks with remediation", () => {
  const g = scoreBlogArticleForGovernance({
    title: "Test",
    bodyHtml: "<p>this section connects the clinical question to safe nursing action</p>",
    slug: "test-slug",
    seoTitle: "Test title for SEO length requirements here",
    seoDescription:
      "A long enough meta description for governance scoring so that only placeholder and depth signals dominate the failure set for this unit test.",
    targetKeyword: "nursing assessment",
    category: "Clinical",
    plannedInternalLinkRows: 0,
  });
  assert.equal(g.publishRecommendation, "block");
  assert.ok(g.remediationHints.some((h) => /placeholder|template/i.test(h)));
  assert.ok(governancePublishBlockingReasons(g).length > 0);
});

test("scoreBlogArticleForGovernance: severe repetition blocks", () => {
  const sentence =
    "The nurse must assess vital signs, perfusion, and mentation, then document findings and notify the provider when criteria are met per facility policy.";
  const inner = Array.from({ length: 14 }, () => sentence).join(" ");
  const block = `<p>${inner}</p>`;
  const body = `<h2>Monitoring</h2><h2>Documentation</h2><h2>Escalation</h2>${block}${block}`;
  const g = scoreBlogArticleForGovernance({
    title: "Monitoring topic",
    bodyHtml: body,
    slug: "monitoring-topic",
    seoTitle: "Monitoring topic for nurses preparing for NCLEX exams",
    seoDescription:
      "Meta description with enough characters to satisfy governance SEO structure checks while repetition dominates the clinical dimensions in this synthetic body.",
    targetKeyword: "nursing monitoring",
    category: "Clinical",
    plannedInternalLinkRows: 4,
  });
  assert.ok(g.dimensions.repetitionResistance <= BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW || g.publishRecommendation === "block");
});
