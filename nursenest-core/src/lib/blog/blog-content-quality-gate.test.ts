/**
 * Blog HTML quality gate — repetition, FAQ/refs duplication, topic-aligned citations, truncation.
 * Run: npx tsx --test src/lib/blog/blog-content-quality-gate.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import {
  blogIntentForQualityGate,
  collectBlogContentQualityIssues,
  maxJaccardOfNewSectionVsPriorSections,
  validateBlogTitleForBodyGeneration,
} from "@/lib/blog/blog-content-quality-gate";
import { stripDuplicateStructuredModulesFromPublicBlogBodyHtml } from "@/lib/blog/blog-public-body-strip";

const REPEATED_FILLER =
  "This section connects the clinical question to bedside priorities for diabetic neuropathy nursing care and exam preparation.";

function fillerWords(seed: number, n: number): string {
  return Array.from({ length: n }, (_, i) => `topic${seed}word${i}`).join(" ");
}

function section(h2: string, seed: number): string {
  return `<h2>${h2}</h2><p>${fillerWords(seed, 140)}</p>`;
}

describe("collectBlogContentQualityIssues (diabetic neuropathy regression)", () => {
  it("blocks repeated paragraphs, banned filler, duplicate FAQ in body, bad refs, duplicate APA, truncated title", () => {
    const dupBody = [
      section("Mechanism", 1),
      section("Assessment", 2),
      `<h2>Nursing interventions</h2><p>${REPEATED_FILLER}</p>`,
      `<h2>Patient teaching</h2><p>${REPEATED_FILLER}</p>`,
      "<h2>FAQs</h2><p>Question one?</p><p>Answer.</p>",
      "<p>Keyword framing for study is not allowed in learner-facing clinical prose.</p>",
    ].join("");
    const issues = collectBlogContentQualityIssues({
      title: "Diabetes care,",
      body: dupBody,
      targetKeyword: "diabetic neuropathy",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: "pathophysiology_strict",
      faqBlock: {
        items: [
          { q: "What is diabetic neuropathy?", a: "Nerve injury from chronic hyperglycemia affecting sensation and autonomic function." },
          { q: "Why does foot care matter?", a: "Loss of protective sensation increases ulcer and infection risk." },
        ],
      },
      apaReferences: [
        "American Diabetes Association. (2024). Standards of Care in Diabetes. Diabetes Care.",
        "American Diabetes Association. (2024). Standards of Care in Diabetes. Diabetes Care.",
        "Surviving Sepsis Campaign. (2021). Hour-1 bundle for septic shock. Critical Care Medicine.",
      ],
      sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
    });
    const ids = issues.filter((i) => i.severity === "block").map((i) => i.id);
    assert.ok(ids.includes("blog_duplicate_paragraph"), `expected duplicate paragraph block, got ${ids.join(",")}`);
    assert.ok(ids.includes("blog_duplicate_faq_module"));
    assert.ok(ids.includes("blog_duplicate_references"));
    assert.ok(ids.includes("blog_reference_topic_mismatch"));
    assert.ok(ids.includes("blog_title_truncation"));
    assert.ok(ids.includes("blog_banned_filler_phrase"));
  });

  it("passes for topic-specific long-form body with on-topic references", () => {
    const body = [
      section("Plain-language summary: diabetic neuropathy", 10),
      section("Pathophysiology mechanism and nerve injury", 11),
      section("Key signs and symptoms", 12),
      section("Assessment priorities in primary care", 13),
      section("Diagnostics and labs for neuropathy", 14),
      section("Nursing interventions and safety", 15),
      section("Medications and treatment considerations", 16),
      section("Patient teaching and foot protection", 17),
      section("NCLEX and REx-PN exam traps", 18),
      section("Escalation red flags", 19),
      section("Mini case application", 20),
      "<h2>Key takeaways</h2><ul><li>Glucose control slows progression.</li><li>Inspect feet daily.</li></ul>",
      "<h2>Related study paths</h2><p>Use flashcards and practice questions on diabetes and neurological care.</p>",
    ].join("");
    const issues = collectBlogContentQualityIssues({
      title: "Diabetic neuropathy for NCLEX-RN and clinical practice",
      body,
      targetKeyword: "diabetic neuropathy",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: "pathophysiology_strict",
      faqBlock: {
        items: [
          { q: "What causes diabetic neuropathy?", a: "Chronic hyperglycemia injures peripheral nerves over time." },
          { q: "What is the ADA foot exam recommendation?", a: "Annual comprehensive foot exam for people with diabetes." },
        ],
      },
      apaReferences: [
        "American Diabetes Association. (2024). Standards of Care in Diabetes—neuropathy section. Diabetes Care.",
        "National Institute of Diabetes and Digestive and Kidney Diseases. (2023). Diabetic neuropathy patient summary. NIDDK.",
      ],
      sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
    });
    const blocking = issues.filter((i) => i.severity === "block");
    assert.equal(
      blocking.length,
      0,
      blocking.map((b) => `${b.id}: ${b.message}`).join("\n"),
    );
  });
});

describe("collectBlogContentQualityIssues — Unicode dash gate (pathophysiology_strict)", () => {
  it("blocks en dash and em dash in body when intent is pathophysiology_strict", () => {
    const body = `<h2>Overview</h2><p>Ranges 5\u201310 mmol/L and one clause\u2014another clause.</p>`;
    const issues = collectBlogContentQualityIssues({
      title: "Electrolyte teaching for nursing students",
      body,
      targetKeyword: "potassium",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: "pathophysiology_strict",
      faqBlock: { items: [{ q: "What is hyperkalemia?", a: "Elevated serum potassium." }] },
      apaReferences: ["World Health Organization. (2023). Clinical guideline summary. WHO."],
      sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
    });
    assert.ok(issues.some((i) => i.id === "blog_unicode_en_em_dash_body" && i.severity === "block"));
  });

  it("does not block Unicode dashes when intent is not pathophysiology_strict", () => {
    const body = `<h2>Note</h2><p>One range\u2013two and a break\u2014here.</p>`;
    const issues = collectBlogContentQualityIssues({
      title: "Short clinical note",
      body,
      targetKeyword: "note",
      postTemplate: BlogPostTemplate.DISEASE_PROCESS_EXPLAINER,
      intent: null,
      faqBlock: { items: [] },
      apaReferences: [],
      sourcesJson: { version: 2, verified: [], excluded: [], generatedAt: new Date().toISOString() },
    });
    assert.equal(
      issues.some((i) => i.id === "blog_unicode_en_em_dash_body"),
      false,
    );
  });
});

describe("validateBlogTitleForBodyGeneration", () => {
  it("accepts complete titles within 30–100 characters", () => {
    const ok = validateBlogTitleForBodyGeneration("Diabetic neuropathy: nursing assessment and foot safety priorities");
    assert.equal(ok.ok, true);
  });
  it("rejects titles over 100 characters", () => {
    const bad = validateBlogTitleForBodyGeneration(`${"word ".repeat(30)}end`);
    assert.equal(bad.ok, false);
    if (!bad.ok) assert.equal(bad.reason, "title_too_long_max_100");
  });
});

describe("maxJaccardOfNewSectionVsPriorSections", () => {
  it("returns high overlap when section prose is nearly identical", () => {
    const prior = "<h2>Mechanism</h2><p>hyperglycemia drives sorbitol accumulation microvascular damage ischemic neuropathy progression</p>";
    const next = "<h2>Assessment</h2><p>hyperglycemia drives sorbitol accumulation microvascular damage ischemic neuropathy progression</p>";
    const score = maxJaccardOfNewSectionVsPriorSections(next, prior);
    assert.ok(score > 0.55, `expected high similarity, got ${score}`);
  });
  it("returns lower overlap when prose uses distinct long tokens", () => {
    const prior =
      "<h2>Mechanism</h2><p>oxidative stress advanced glycation endothelial dysfunction autonomic denervation cascades uniquelyone</p>";
    const next =
      "<h2>Assessment</h2><p>monofilament vibration achilles reflex stocking glove sensory loss gait instability uniquelytwo</p>";
    const score = maxJaccardOfNewSectionVsPriorSections(next, prior);
    assert.ok(score < 0.35, `expected low similarity, got ${score}`);
  });
});

describe("blogIntentForQualityGate", () => {
  it("treats disease-process explainer as strict pathophysiology even when intent is null", () => {
    assert.equal(
      blogIntentForQualityGate(BlogPostTemplate.DISEASE_PROCESS_EXPLAINER, null),
      "pathophysiology_strict",
    );
    assert.equal(blogIntentForQualityGate(BlogPostTemplate.DISEASE_PROCESS_EXPLAINER, undefined), "pathophysiology_strict");
  });
  it("does not infer strict profile for unrelated templates with null intent", () => {
    assert.equal(blogIntentForQualityGate(BlogPostTemplate.FAQ_STYLE, null), null);
  });
  it("still enables strict profile for concept explainer on long-form templates", () => {
    assert.equal(
      blogIntentForQualityGate(BlogPostTemplate.TOPIC_EXPLAINED, BlogPostIntent.CONCEPT_EXPLAINER),
      "pathophysiology_strict",
    );
  });
});

describe("stripDuplicateStructuredModulesFromPublicBlogBodyHtml", () => {
  it("removes embedded FAQ when structured FAQ renders", () => {
    const html =
      "<h2>Overview</h2><p>Intro text here.</p><h2>FAQs</h2><p>Q?</p><p>A.</p><h2>More</h2><p>End.</p>";
    const out = stripDuplicateStructuredModulesFromPublicBlogBodyHtml(html, {
      hasStructuredFaq: true,
      hasStructuredReferences: false,
    });
    assert.match(out, /Overview/i);
    assert.doesNotMatch(out, /<h2[^>]*>\s*FAQs?\s*<\/h2>/i);
  });
});
