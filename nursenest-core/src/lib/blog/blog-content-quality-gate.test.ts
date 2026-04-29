/**
 * Blog HTML quality gate — repetition, FAQ/refs duplication, topic-aligned citations, truncation.
 * Run: npx tsx --test src/lib/blog/blog-content-quality-gate.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogPostTemplate } from "@prisma/client";
import { collectBlogContentQualityIssues } from "@/lib/blog/blog-content-quality-gate";
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
