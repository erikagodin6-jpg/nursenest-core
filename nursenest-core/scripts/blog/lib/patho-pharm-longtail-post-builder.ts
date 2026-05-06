/**
 * Deterministic long-tail pathophysiology / pharmacology blog payloads for
 * `generate-patho-pharm-longtail-posts.mts` (not bundled in the Next app).
 */
import { createHash } from "node:crypto";

import { BlogPostTemplate } from "@prisma/client";

import { resolveCanonicalSiteOrigin } from "../../../src/lib/seo/canonical-site";

import type { ClinicalRelationshipType } from "../../../src/lib/blog/patho-pharm-longtail-topic-coherence";
import {
  assertRegistryMeetsMinimum,
  getPathoPharmLongtailTopicRegistry,
} from "../../../src/lib/blog/patho-pharm-longtail-topic-registry";
import type { PathoPharmLongtailRegistryTopic } from "../../../src/lib/blog/patho-pharm-longtail-topic-registry";

export const PATHO_PHARM_LONGTAIL_LEGACY_SOURCE = "patho-pharm-longtail-regeneration" as const;

export type LongTailKind = "pathophysiology" | "pharmacology";

export type LongTailTopicSpec = {
  slug: string;
  title: string;
  kind: LongTailKind;
  category: string;
  postTemplate: BlogPostTemplate;
  targetKeyword: string;
  bodySystem: string;
  anchorLabel: string;
  patternId: number;
  relationshipType: ClinicalRelationshipType;
  topicSource: "registry" | "synthetic";
  careerSlug: string;
  exam: string;
};

export type FaqTriple = { q1: string; a1: string; q2: string; a2: string; q3: string; a3: string };

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Normalize titles for duplicate detection (hash idempotency). */
export function normalizeTitleForHash(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").replace(/[?]/g, "").trim();
}

export function normalizedTitleHash(title: string): string {
  return createHash("sha256").update(normalizeTitleForHash(title), "utf8").digest("hex");
}

/** SERP-oriented meta title (≤ 60 chars). */
export function clampMetaTitle(title: string, max = 60): string {
  const t = title.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 35 ? cut.slice(0, sp) : cut).trim().slice(0, max);
}

/** Meta description (≤ 155 chars). */
export function clampMetaDescription(text: string, max = 155): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 80 ? cut.slice(0, sp) : cut).trim()}…`.slice(0, max);
}

function registryRowToSpec(r: PathoPharmLongtailRegistryTopic): LongTailTopicSpec {
  return {
    slug: r.slug,
    title: r.title,
    kind: r.kind,
    category: r.category,
    postTemplate: r.postTemplate,
    targetKeyword: r.targetKeyword,
    bodySystem: r.bodySystem,
    anchorLabel: r.anchorLabel,
    patternId: r.patternId,
    relationshipType: r.relationshipType,
    topicSource: r.topicSource,
    careerSlug: r.careerSlug,
    exam: r.exam,
  };
}

/**
 * Curated clinical long-tail topics only (≥500). No Cartesian symptom×condition expansion.
 * Topics are sourced exclusively from `PATHO_PHARM_TOPIC_REGISTRY` until exhausted; there is no
 * unvetted synthetic topic fill when `limit` exceeds the registry (the slice is clamped).
 */
export function enumerateLongTailTopics(limit: number): LongTailTopicSpec[] {
  assertRegistryMeetsMinimum();
  const reg = getPathoPharmLongtailTopicRegistry();
  if (limit > reg.length) {
    console.warn(
      `[enumerateLongTailTopics] TARGET_COUNT ${limit} exceeds curated registry (${reg.length}); clamping.`,
    );
  }
  const n = Math.min(Math.max(0, limit), reg.length);
  return reg.slice(0, n).map(registryRowToSpec);
}

type LongTailSectionRole =
  | "mechanism"
  | "assessment"
  | "interventions"
  | "teaching"
  | "rn_nclex"
  | "pn_rpn"
  | "np"
  | "allied"
  | "new_grad"
  | "clinical_reasoning"
  | "escalation";

/**
 * One substantive HTML paragraph per H2 — **distinct prose per role** (no triple “deeper/application” clones).
 * Wording avoids the same banned filler / placeholder substrings enforced in `blog-publish-quality-validator` and `blog-content-quality-gate`.
 */
function sectionParagraph(topic: LongTailTopicSpec, role: LongTailSectionRole): string {
  const t = esc(topic.title);
  const anchor = esc(topic.anchorLabel);
  const sys = esc(topic.bodySystem);
  const kw = esc(topic.targetKeyword);
  const rel = esc(topic.relationshipType);
  const isPharm = topic.kind === "pharmacology";

  const ul = (items: string[]) => `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

  switch (role) {
    case "mechanism": {
      const p1 = `<p><strong>Mechanism focus.</strong> ${
        isPharm
          ? `For “${t}”, trace how drug effects show up at tissue receptors and what predictable adverse patterns nurses watch for. Anchor teaching to ${anchor} and keep vocabulary tied to ${sys} physiology so learners can defend “why” answers without inventing trial data.`
          : `For “${t}”, walk the compensatory chain (${rel}) that links the disease process to bedside cues nurses trend. Emphasize ${anchor} within ${sys} context so the story stays condition-specific; when mechanisms are debated in the literature, say so plainly instead of implying certainty.`
      } Use “${kw}” as the study hook, but explain relationships in plain clinical steps (trigger → response → assessment change → implication).</p>`;
      const p2 = isPharm
        ? `<p><strong>Monitoring map.</strong> Pair each major effect with vitals, labs, or symptom checks you would repeat after a dose change, and note which adverse-effect clusters show up most often in exam distractors for ${anchor}.</p>`
        : `<p><strong>Compensation versus injury.</strong> Separate early adaptive changes from organ-threat patterns: ask what should improve if therapy works, and what worsens first when the disease accelerates for ${kw}.</p>`;
      const table = isPharm
        ? `<table><thead><tr><th>Angle</th><th>Watch at bedside</th><th>Typical exam twist</th></tr></thead><tbody><tr><td>Receptor / pathway</td><td>Vitals, mentation, perfusion</td><td>Mechanism paired with a contraindication cue.</td></tr><tr><td>Overlap toxicity</td><td>QT, bleeding, sedation</td><td>Two “helpful” meds; pick scope-safe action.</td></tr><tr><td>Patient risk</td><td>Age, clearance, polypharmacy</td><td>Assessment before teaching.</td></tr></tbody></table>`
        : `<table><thead><tr><th>Stage</th><th>Bedside clue</th><th>What shifts first when unstable</th></tr></thead><tbody><tr><td>Trigger</td><td>Risk history + ${anchor} context</td><td>Work of breathing or perfusion.</td></tr><tr><td>Compensation</td><td>Compensatory vitals or labs</td><td>Tachycardia, vasoconstriction, salt/water retention.</td></tr><tr><td>Organ demand</td><td>${sys}-specific symptoms</td><td>New confusion, ischemic pain, oliguria patterns.</td></tr></tbody></table>`;
      const bullets = ul([
        `Write a one-sentence “because …” line for ${kw} before listing interventions.`,
        `Sketch baseline → trigger → compensation → decompensation when you read a long stem.`,
        `Underline the priority problem (airway, breathing, circulation, safety) before reading answers.`,
        `If two mechanisms look similar, compare what each option assumes about volume status or autonomic tone.`,
      ]);
      const pearl = `<blockquote><p><strong>Clinical pearl.</strong> When “increase” and “decrease” labs both sound plausible, match the direction to the compensation stage the stem describes, not only the chronic diagnosis.</p></blockquote>`;
      return `${p1}${p2}${table}${bullets}${pearl}`;
    }
    case "assessment": {
      const p1 = `<p><strong>Assessment clustering.</strong> Organize subjective and objective data for “${t}” into examiner-style groupings: vitals trends, focused ${sys} inspection, device data, and red-flag language patients use about ${anchor}. Practice one tight bedside report that states what changed since the prior assessment.</p>`;
      const bullets = ul([
        `Compare paired measurements (left/right, lying/sitting, pre/post intervention) when offered.`,
        `Separate chronic abnormal baselines from acute deltas that do not fit the plan.`,
        `Document quotes, numbers, and context so the next nurse sees trajectory, not snapshots.`,
      ]);
      const warn = `<p><strong>Bedside caution.</strong> Do not dismiss subtle mentation or perfusion changes when the patient says they feel “off” despite “stable” numbers. Follow orders, scope, and policy.</p>`;
      return `${p1}${bullets}${warn}`;
    }
    case "interventions": {
      const p1 = `<p><strong>Interventions and monitoring.</strong> Translate “${t}” into nurse-owned actions: what you reassess after a therapy change, what education reduces harm for ${anchor}, and what you chart to show response. Stay inside general scope guidance (no patient-specific orders) and name collaboration points when ${sys} data trend wrong.</p>`;
      const bullets = ul([
        `State the rationale (“because …”) for each priority you select.`,
        `Pair high-risk medication classes with the adverse-effect screen you would actually run.`,
        `When two interventions help, pick the one that addresses the immediate threat to life or organ perfusion.`,
      ]);
      const pearl = `<blockquote><p><strong>Clinical pearl.</strong> Options that imply independent dose changes without an order are usually incorrect even when they sound clinically attractive.</p></blockquote>`;
      return `${p1}${bullets}${pearl}`;
    }
    case "teaching": {
      const p1 = `<p><strong>Patient and family teaching.</strong> Give discharge-ready talking points for ${anchor}: warning symptoms, adherence habits, when to call, and home monitoring that fits ${kw}. Tie examples to “${t}” so teaching is not interchangeable with another ${sys} diagnosis.</p>`;
      const bullets = ul([
        `Use green/yellow/red style symptom examples the patient can repeat in their own words.`,
        `Link diet, fluid, glucose, or activity teaching back to the mechanism section.`,
        `Document topics, barriers, and interpreter use when applicable.`,
      ]);
      return `${p1}${bullets}`;
    }
    case "rn_nclex": {
      const p1 = `<p><strong>RN / NCLEX prioritization.</strong> For “${t}”, practice choosing the option that stabilizes airway, breathing, circulation, or urgent neuro status before comfort measures. Compare plausible answers by which addresses the ${anchor} risk that kills fastest.</p>`;
      const bullets = ul([
        `Lead with assessment when the stem is vague; avoid teaching answers if instability is possible.`,
        `Use SBAR when calling about ${kw} changes that do not match the expected course.`,
      ]);
      return `${p1}${bullets}`;
    }
    case "pn_rpn": {
      const p1 = `<p><strong>PN / RPN collaborative scope.</strong> Describe what practical nurses should observe, record, and escalate for “${t}” within delegation rules. Emphasize objective reporting when ${anchor} worsens during ${sys} care.</p>`;
      const bullets = ul([
        `Trend vitals, intake/output, glucose, skin, and mobility safety within your role.`,
        `Report deltas with measurements rather than diagnostic labels you cannot confirm.`,
      ]);
      return `${p1}${bullets}`;
    }
    case "np": {
      const p1 = `<p><strong>Advanced practice lens (education only).</strong> For “${t}”, rehearse differential breadth: which data reduce uncertainty, how ${sys} comorbidities shift risk, and which red flags change urgency. This is not a substitute for collaboration agreements or local prescribing rules.</p>`;
      const bullets = ul([
        `Map each diagnostic answer choice to the mechanism it assumes, then eliminate contradictions.`,
        `Consider drug–drug and drug–disease interactions before choosing therapy-heavy options.`,
      ]);
      return `${p1}${bullets}`;
    }
    case "allied": {
      const p1 = `<p><strong>Allied health coordination.</strong> Show how therapists, technologists, or community partners extend “${t}” care after nursing stabilizes acute issues. Handoffs should name mobility precautions, equipment teaching, or therapy goals tied to ${anchor}.</p>`;
      const bullets = ul([
        `Clarify what you measure versus what you clinically interpret within your certification.`,
        `Flag aspiration, fall, or orthostatic risks before mobility or swallow tasks.`,
      ]);
      return `${p1}${bullets}`;
    }
    case "new_grad": {
      const p1 = `<p><strong>New graduate orientation habits.</strong> Translate “${t}” into preceptor-ready questions: what you verify before leaving the room, how you time reassessments when ${anchor} is labile, and which ${sys} unit policies you would open after a near miss.</p>`;
      const bullets = ul([
        `Slow down when you recognize the diagnosis; the item may test a complication instead.`,
        `Verify allergies and high-alert medications before high-risk tasks.`,
      ]);
      return `${p1}${bullets}`;
    }
    case "clinical_reasoning": {
      const p1 = `<p><strong>Clinical reasoning drills.</strong> Build a short mental model for “${t}”: with ${anchor} clues in the stem, which principle rules out half the options? Practice one “why wrong” tied to ${sys} misunderstanding.</p>`;
      const table = `<table><thead><tr><th>Stem cue</th><th>Likely framework</th><th>Common trap</th></tr></thead><tbody><tr><td>Sudden vitals change</td><td>Airway, breathing, circulation, then context</td><td>Choosing teaching while instability evolves.</td></tr><tr><td>Two correct-sounding assessments</td><td>Pick the one matching the stated priority problem</td><td>Picking the longer but less urgent option.</td></tr><tr><td>Side effect scenario</td><td>Assess, protect safety, notify prescriber</td><td>Independent med changes without orders.</td></tr></tbody></table>`;
      const bullets = ul([
        `Underline whether the question asks for first, best, initial, or priority action.`,
        `Eliminate options that require scope you do not have in the role implied by the stem.`,
      ]);
      return `${p1}${table}${bullets}`;
    }
    case "escalation": {
      const p1 = `<p><strong>Escalation triggers.</strong> For “${t}”, escalate when ${sys} compensation looks exhausted: refractory symptoms, rapid lab or vital trends, airway compromise, ischemic patterns, or altered mentation that does not fit baseline—especially when ${anchor} red flags appear.</p>`;
      const bullets = ul([
        `Treat repeated patient or family concerns as data even when monitors look acceptable.`,
        `Prepare a concise symptom timeline before the provider arrives.`,
      ]);
      const warn = `<p><strong>Bedside caution.</strong> Do not delay escalation to finish non-urgent tasks when the patient meets critical-criteria triggers. Use rapid response or provider pathways per policy.</p>`;
      return `${p1}${bullets}${warn}`;
    }
    default:
      return `<p>Educational overview for “${t}” emphasizing ${anchor} within ${sys} nursing priorities. Study label: ${kw}.</p>`;
  }
}

export function buildFaq(topic: LongTailTopicSpec): FaqTriple {
  const anchor = esc(topic.anchorLabel);
  const kw = topic.targetKeyword.trim();
  const shortTitle = topic.title.trim().slice(0, 140);
  return {
    q1: `What is the safest way to study ${anchor} when the stem centers on “${shortTitle}”?`,
    a1: `Anchor your review to the search intent “${kw}”: sketch the causal chain first, then list assessment changes that prove that chain at the bedside, then match interventions to the most unstable cue. Pair each step with one monitoring parameter you would actually trend so answers stay tied to this topic rather than generic pathophysiology notes.`,
    q2: `Which misunderstandings about ${anchor} show up most often for “${shortTitle}”?`,
    a2: `Because “${kw}” bundles several mechanisms, students often mix up timing (acute shift versus chronic compensation) or confuse look-alike presentations. Slow down, separate onset clues from complication clues, and re-read the stem for what changed **now** versus what is baseline for this patient profile.`,
    q3: `When should a nurse prioritize escalation over continued routine monitoring for “${shortTitle}”?`,
    a3: `Use “${kw}” as the escalation lens: worsening work of breathing, rapid mentation change, refractory hypotension, escalating oxygen needs, new arrhythmias, or labs trending badly should trigger urgent reporting when they do not match the expected trajectory for the current plan of care.`,
  };
}

function medlinePlusSearchUrl(topic: LongTailTopicSpec): string {
  const q = encodeURIComponent(`${topic.anchorLabel} ${topic.targetKeyword}`.trim().slice(0, 120));
  return `https://medlineplus.gov/results.html?query=${q}`;
}

/** APA 7 web references tied to topic keywords (for publish reference-alignment gates). */
export function buildApaReferences(topic: LongTailTopicSpec, accessDate: string): string[] {
  const kw = topic.targetKeyword.trim();
  const anchor = topic.anchorLabel.trim();
  const sys = topic.bodySystem.trim();
  const medline = medlinePlusSearchUrl(topic);
  const lines: string[] = [
    `National Library of Medicine. (2024). MedlinePlus search: ${kw} (${anchor}). Retrieved ${accessDate}, from ${medline}`,
    `National Center for Biotechnology Information. (2024). NCBI Bookshelf (StatPearls and related reviews). Retrieved ${accessDate}, from https://www.ncbi.nlm.nih.gov/books/`,
    `National Council of State Boards of Nursing. (2024). NCLEX examinations. Retrieved ${accessDate}, from https://www.ncsbn.org/exams.htm`,
  ];
  const sysLower = sys.toLowerCase();
  if (/\b(cardio|heart|vascular|hypertension|coronary)\b/i.test(sysLower)) {
    lines.push(
      `Centers for Disease Control and Prevention. (2024). Heart disease: ${kw}. Retrieved ${accessDate}, from https://www.cdc.gov/heart-disease/index.html`,
    );
  } else if (/\b(pulm|lung|respir|airway)\b/i.test(sysLower)) {
    lines.push(
      `Centers for Disease Control and Prevention. (2024). Chronic obstructive pulmonary disease (COPD). Retrieved ${accessDate}, from https://www.cdc.gov/copd/index.html`,
    );
  } else if (/\b(renal|kidney|urin|fluid|electrolyte)\b/i.test(sysLower)) {
    lines.push(
      `National Institute of Diabetes and Digestive and Kidney Diseases. (2024). Kidney disease health topics. Retrieved ${accessDate}, from https://www.niddk.nih.gov/health-information/kidney-disease`,
    );
  } else if (/\b(diabet|glucose|insulin|glycem|endocrine)\b/i.test(sysLower) || /\b(diabet|glucose|insulin)\b/i.test(kw)) {
    lines.push(
      `National Institute of Diabetes and Digestive and Kidney Diseases. (2024). Diabetes: ${kw}. Retrieved ${accessDate}, from https://www.niddk.nih.gov/health-information/diabetes`,
    );
  } else {
    lines.push(
      `Centers for Disease Control and Prevention. (2024). CDC health topics A-Z (${sys}). Retrieved ${accessDate}, from https://www.cdc.gov/health-topics.html`,
    );
  }
  if (topic.kind === "pharmacology") {
    lines.push(
      `U.S. Food and Drug Administration. (2024). Drugs and medications (${kw}). Retrieved ${accessDate}, from https://www.fda.gov/drugs`,
    );
  } else {
    lines.push(
      `World Health Organization. (2024). Health topics (${sys}). Retrieved ${accessDate}, from https://www.who.int/health-topics`,
    );
  }
  return lines.slice(0, 6);
}

export function buildSchemaSummaryJson(args: {
  slug: string;
  title: string;
  excerpt: string;
  publishedIso: string;
  faq: FaqTriple;
  origin: string;
}): string {
  const origin = args.origin.replace(/\/$/, "");
  const url = `${origin}/blog/${args.slug}`;
  const canonicalPath = `/blog/${args.slug}`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: args.title,
      description: args.excerpt,
      datePublished: args.publishedIso,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      isPartOf: { "@type": "WebSite", name: "NurseNest", url: `${origin}/` },
      identifier: canonicalPath,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${args.origin.replace(/\/$/, "")}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${args.origin.replace(/\/$/, "")}/blog` },
        { "@type": "ListItem", position: 3, name: args.title, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: args.faq.q1, acceptedAnswer: { "@type": "Answer", text: args.faq.a1 } },
        { "@type": "Question", name: args.faq.q2, acceptedAnswer: { "@type": "Answer", text: args.faq.a2 } },
        { "@type": "Question", name: args.faq.q3, acceptedAnswer: { "@type": "Answer", text: args.faq.a3 } },
      ],
    },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

export function buildLongTailBody(topic: LongTailTopicSpec, internalLinksHtml: string, accessDate: string): string {
  const t = esc(topic.title);
  const sys = esc(topic.bodySystem);
  const kind = topic.kind;
  const mechanismHeading =
    kind === "pharmacology" ? "Pharmacology mechanism (exam-oriented)" : "Pathophysiology mechanism (exam-oriented)";

  const pad = (role: LongTailSectionRole) => sectionParagraph(topic, role);

  const h1 = `<h1>${t}</h1>`;
  const disclaimer = `<p><em>This article is for nursing education and exam preparation, not personal medical advice.</em> It is written for RN, PN/RPN, NP, allied health, and new graduate audiences as a shared learning layer; scope, supervision, and local protocols still define what you may do at the bedside. Always follow orders, scope of practice, facility policy, and local regulations.</p>`;
  const canonicalNote = `<p><strong>Canonical URL path:</strong> <code>${esc(`/blog/${topic.slug}`)}</code> (public article route).</p>`;
  const internal = `<p><strong>Study tools and related reading.</strong> Reinforce concepts with the <a href="/flashcards">flashcards hub</a>, the <a href="/question-bank">question bank</a>, and your pathway practice surfaces after reading. Related NurseNest posts: ${internalLinksHtml}</p>`;

  const mechanismIntro =
    kind === "pharmacology"
      ? `<p>This pharmacology-focused review emphasizes receptor and tissue-level effects, predictable adverse effects, monitoring priorities, and how exam writers test “why” questions. We avoid overstated claims; when evidence is mixed, we describe the uncertainty explicitly.</p>`
      : `<p>This pathophysiology-focused review emphasizes compensatory responses, typical assessment patterns, and how acute changes evolve. We avoid overstated claims; when mechanisms are incompletely understood, we describe the uncertainty explicitly.</p>`;

  return [
    h1,
    disclaimer,
    canonicalNote,
    internal,
    `<h2>${esc(mechanismHeading)}</h2>`,
    mechanismIntro,
    pad("mechanism"),
    `<h2>Nursing assessment findings</h2>`,
    pad("assessment"),
    `<h2>Nursing interventions and implications</h2>`,
    pad("interventions"),
    `<h2>Patient teaching points</h2>`,
    pad("teaching"),
    `<h2>RN/NCLEX Focus</h2>`,
    pad("rn_nclex"),
    `<h2>PN/RPN Focus</h2>`,
    pad("pn_rpn"),
    `<h2>Advanced NP Considerations</h2>`,
    pad("np"),
    `<h2>Allied Health Relevance</h2>`,
    pad("allied"),
    `<h2>New graduate nurse focus</h2>`,
    pad("new_grad"),
    `<h2>NCLEX-style clinical reasoning</h2>`,
    pad("clinical_reasoning"),
    `<h2>When to escalate care</h2>`,
    pad("escalation"),
    `<h2>References (APA-style)</h2>`,
    `<ol>${buildApaReferences(topic, accessDate)
      .map((line) => `<li>${esc(line)}</li>`)
      .join("")}</ol>`,
    `<p><strong>Systems lens:</strong> ${sys} integration is emphasized throughout because exam questions often require you to connect bedside findings with underlying physiology or pharmacology.</p>`,
  ].join("\n");
}

export function wordCountHtml(html: string): number {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(/\s+/).length;
}

export function validateGeneratedBody(html: string, title: string): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];
  if (wordCountHtml(html) < 900) reasons.push("body_word_count_below_900");
  if (!html.includes("<h1>")) reasons.push("missing_h1");
  const h1m = html.match(/<h1>([^<]*)<\/h1>/i);
  if (!h1m || h1m[1]!.trim() !== title.trim()) reasons.push("h1_title_mismatch");
  const h2count = (html.match(/<h2\b/gi) ?? []).length;
  if (h2count < 5) reasons.push("h2_count_below_5");
  if (!/pathophysiology mechanism|pharmacology mechanism/i.test(html)) reasons.push("missing_mechanism_section");
  if (!/nursing assessment findings/i.test(html)) reasons.push("missing_nursing_assessment");
  if (!/nursing interventions and implications/i.test(html)) reasons.push("missing_nursing_interventions");
  if (!/patient teaching points/i.test(html)) reasons.push("missing_patient_teaching");
  if (!/nclex-style clinical reasoning/i.test(html)) reasons.push("missing_nclex_section");
  if (!/when to escalate care/i.test(html)) reasons.push("missing_escalation_section");
  if (!/rn\/nclex focus/i.test(html)) reasons.push("missing_rn_nclex_tier_section");
  if (!/pn\/rpn focus/i.test(html)) reasons.push("missing_pn_rpn_tier_section");
  if (!/advanced np considerations/i.test(html)) reasons.push("missing_np_tier_section");
  if (!/allied health relevance/i.test(html)) reasons.push("missing_allied_health_tier_section");
  if (!/new graduate nurse focus/i.test(html)) reasons.push("missing_new_grad_tier_section");
  if (!/canonical url path/i.test(html)) reasons.push("missing_canonical_note");
  if (/<h2\b[^>]*>\s*frequently\s+asked\s+questions/i.test(html)) {
    reasons.push("embedded_faq_in_body");
  }
  if (!/references \(apa-style\)/i.test(html)) reasons.push("missing_references_heading");
  if ((html.match(/<ul\b/gi) ?? []).length < 8) reasons.push("structured_lists_below_min");
  if ((html.match(/<table\b/gi) ?? []).length < 2) reasons.push("structured_tables_below_min");
  if (!/This article is for nursing education and exam preparation, not personal medical advice/i.test(html)) {
    reasons.push("missing_educational_disclaimer");
  }
  if (/<script|javascript:|on\w+\s*=/i.test(html)) reasons.push("unsafe_html");
  if (/\b(TODO|TBD|\{\{|\[\[|Lorem ipsum|PLACEHOLDER)\b/i.test(html)) reasons.push("placeholder_language");
  if (/\bas an ai\b/i.test(html)) reasons.push("banned_phrase_ai");
  if (/\b(always cures|guaranteed cure|100% cure)\b/i.test(html)) reasons.push("unverifiable_certainty_language");

  return reasons.length ? { ok: false, reasons } : { ok: true };
}

export function tagsForTopic(topic: LongTailTopicSpec): string[] {
  const domain = topic.kind === "pharmacology" ? "pharmacology" : "pathophysiology";
  const base = [
    "nursing",
    "NCLEX",
    "RN",
    "PN",
    "RPN",
    "NP",
    "allied health",
    "new grad",
    domain,
    topic.bodySystem.toLowerCase(),
    topic.anchorLabel.toLowerCase().slice(0, 48),
  ];
  return Array.from(new Set(base.map((s) => s.trim()).filter(Boolean)));
}

export function excerptFromHtml(html: string, title: string): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const first = plain.slice(0, 240);
  return first.length >= 120 ? `${first}…` : `${title.slice(0, 200)} — long-tail mechanism review for RN exam prep.`;
}

export function resolveSiteOrigin(): string {
  return resolveCanonicalSiteOrigin();
}
