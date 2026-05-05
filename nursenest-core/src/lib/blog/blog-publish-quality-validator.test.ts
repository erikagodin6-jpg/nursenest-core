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
