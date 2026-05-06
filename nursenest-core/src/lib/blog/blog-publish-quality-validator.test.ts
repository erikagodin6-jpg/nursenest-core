import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateBlogPublishQuality } from "@/lib/blog/blog-publish-quality-validator";

const GOOD_PARAS = {
  mechanism:
    "Heart failure lowers forward cardiac output and raises ventricular filling pressures, so fluid backs into the lungs while kidney perfusion falls. Nurses connect crackles, new oxygen need, daily weight gain, and rising work of breathing to the same pump problem instead of treating each cue as separate.",
  assessment:
    "Focused assessment starts with airway and breathing, then compares lung sounds, edema, jugular venous distention, urine output, mental status, and activity tolerance. A sudden drop in oxygen saturation with pink frothy sputum is more urgent than stable ankle edema because it suggests pulmonary edema.",
  interventions:
    "Priority interventions include high-Fowler positioning, oxygen as prescribed, rapid vital-sign reassessment, medication reconciliation, and timely communication about worsening respiratory status. Diuretics require monitoring urine output, potassium, blood pressure, and symptoms of dizziness or dehydration.",
  teaching:
    "Discharge teaching should be concrete: weigh at the same time daily, report rapid weight gain, limit sodium as prescribed, take diuretics earlier in the day when possible, and call for increasing dyspnea, swelling, or reduced exercise tolerance.",
  escalation:
    "Escalate immediately for severe dyspnea at rest, new confusion, chest pain, cyanosis, frothy sputum, hypotension, or oxygen needs that keep rising despite initial positioning and prescribed therapy. These cues can indicate acute decompensation.",
  exam:
    "On NCLEX-style items, choose the option that protects oxygenation and circulation first. If two answers are plausible, ask which action addresses the unstable cue now: worsening breathing beats routine education, and potassium assessment matters before loop diuretic complications.",
};

function goodBody(): string {
  return `
    <p>NCLEX-style scenario: a client with heart failure reports new shortness of breath after missing diuretic doses.</p>
    <h2>Pathophysiology and mechanism</h2><p>${GOOD_PARAS.mechanism}</p>
    <h2>Assessment cues and symptoms</h2><p>${GOOD_PARAS.assessment}</p>
    <h2>Nursing interventions and priorities</h2><p>${GOOD_PARAS.interventions}</p>
    <h2>Patient teaching and discharge safety</h2><p>${GOOD_PARAS.teaching}</p>
    <h2>Escalation red flags</h2><p>${GOOD_PARAS.escalation}</p>
    <h2>NCLEX exam reasoning</h2><p>${GOOD_PARAS.exam}</p>
  `;
}

function placeholderBody(): string {
  const para =
    "This section connects the clinical question to safe nursing action. It gives learners a clinically relevant way to think about the topic while keeping exam-aligned framing without overcomplicating the review.";
  return `
    <h2>Mechanism</h2><p>${para}</p>
    <h2>Assessment</h2><p>${para}</p>
    <h2>Interventions</h2><p>${para}</p>
    <h2>Teaching</h2><p>${para}</p>
    <h2>Exam reasoning</h2><p>${para}</p>
  `;
}

describe("validateBlogPublishQuality", () => {
  it("rejects the current placeholder-style repeated generated article", () => {
    const result = validateBlogPublishQuality({
      title: "Heart failure nursing assessment for NCLEX",
      body: placeholderBody(),
      targetKeyword: "heart failure nursing assessment",
      faqBlock: {
        items: [
          { q: "Why does this matter?", a: "This topic is important and it depends on the situation." },
          { q: "What should I remember?", a: "Always follow your facility policy and understand the basics." },
        ],
      },
      apaReferences: [
        "Centers for Disease Control and Prevention. (2024). Stroke facts.",
        "National Institutes of Health. (2022). Sepsis overview.",
        "Agency for Healthcare Research and Quality. (2021). Pneumonia safety.",
      ],
    });
    assert.equal(result.ok, false);
    assert.ok(result.blocking.some((i) => i.id === "blog_placeholder_phrase"));
    assert.ok(result.blocking.some((i) => i.id === "blog_repeated_paragraph"));
    assert.ok(result.blocking.some((i) => i.id === "blog_generic_faq_answers"));
  });

  it("rejects obvious primary-keyword stuffing in long bodies", () => {
    const phrase = "diabetic autonomic neuropathy nursing assessment";
    /** One long paragraph so duplicate-`<p>` equality checks do not fire before density heuristics. */
    const padded = `<p>${(phrase + " ").repeat(28).trim()}</p>`;
    const body = `${goodBody()}\n${padded}`;
    const result = validateBlogPublishQuality({
      title: "Diabetic autonomic neuropathy nursing assessment for NCLEX",
      body,
      targetKeyword: phrase,
      faqBlock: {
        items: [
          {
            q: "Which assessment finding matters most in diabetic autonomic neuropathy?",
            a: "Orthostatic hypotension or silent ischemia patterns can appear because autonomic nerves that regulate vessels and cardiac pain perception are impaired.",
          },
          {
            q: "Why is glycemic history part of the assessment picture?",
            a: "Chronic hyperglycemia drives the nerve injury trajectory, so A1c trends and hypoglycemia unawareness questions belong in the same assessment thread.",
          },
        ],
      },
      apaReferences: [
        "American Diabetes Association. (2024). Standards of care in diabetes.",
        "National Institute of Diabetes and Digestive and Kidney Diseases. (2023). Diabetic neuropathy.",
        "National Council of State Boards of Nursing. (2023). NCLEX-RN test plan.",
      ],
    });
    assert.equal(result.ok, false);
    assert.ok(result.blocking.some((i) => i.id === "blog_keyword_stuffing_primary_phrase"));
  });

  it("rejects bodies that never substantively echo the title tokens", () => {
    const vague = `
      <h2>Mechanism</h2><p>Healthcare is complex and requires careful attention to many different factors that nurses must consider.</p>
      <h2>Assessment</h2><p>Assessment should be thorough and reflect best practices across diverse clinical environments.</p>
      <h2>Interventions</h2><p>Interventions depend on context and should always follow policy while supporting patient safety.</p>
      <h2>Teaching</h2><p>Education should be clear and tailored to the learner without overwhelming detail.</p>
      <h2>Exam reasoning</h2><p>Tests often reward systematic elimination and prioritization skills.</p>
    `;
    const result = validateBlogPublishQuality({
      title: "Hyperkalemia ECG changes and emergency nursing priorities",
      body: vague,
      targetKeyword: "hyperkalemia ECG peaked T waves nursing",
      category: "Med-Surg",
      tags: ["hyperkalemia", "ecg", "emergency"],
      faqBlock: {
        items: [
          {
            q: "What ECG change is classically tied to hyperkalemia?",
            a: "Peaked T waves and widened QRS complexes can progress toward sine-wave morphology as potassium rises.",
          },
          {
            q: "What is the nurse's first safety priority?",
            a: "Recognize unstable cardiac conduction, repeat the rhythm strip, and activate the provider chain for emergent therapy per orders and protocol.",
          },
        ],
      },
      apaReferences: [
        "American Heart Association. (2022). Advanced cardiovascular life support.",
        "National Council of State Boards of Nursing. (2023). NCLEX-RN test plan.",
      ],
    });
    assert.equal(result.ok, false);
    assert.ok(result.blocking.some((i) => i.id === "blog_title_body_topic_drift"));
  });

  it("accepts a real topic-specific clinical post", () => {
    const result = validateBlogPublishQuality({
      title: "Heart failure nursing assessment and NCLEX priorities",
      body: goodBody(),
      targetKeyword: "heart failure nursing assessment",
      category: "Cardiovascular",
      tags: ["heart failure", "nclex", "nursing assessment"],
      faqBlock: {
        items: [
          {
            q: "Which heart failure finding should the nurse escalate first?",
            a: "New severe dyspnea with falling oxygen saturation is more urgent than stable edema because it signals impaired oxygenation and possible pulmonary edema.",
          },
          {
            q: "Why do daily weights matter in heart failure?",
            a: "Daily weights help detect fluid retention before the client has severe respiratory symptoms, so nurses can reinforce the prescribed action plan early.",
          },
        ],
      },
      apaReferences: [
        "American Heart Association. (2024). Heart failure signs and symptoms.",
        "National Heart, Lung, and Blood Institute. (2023). Heart failure.",
        "National Council of State Boards of Nursing. (2023). NCLEX test plans.",
      ],
    });
    assert.equal(result.ok, true, result.blocking.map((i) => i.message).join("; "));
  });
});
