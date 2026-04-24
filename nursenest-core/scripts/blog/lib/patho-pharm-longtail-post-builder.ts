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

function paragraphBlock(topic: LongTailTopicSpec, label: string): string {
  const t = esc(topic.title);
  const sys = esc(topic.bodySystem);
  const kw = esc(topic.targetKeyword);
  return `<p><strong>${esc(label)}.</strong> This section connects the clinical question “${t}” to ${sys}-focused nursing assessment and teaching priorities. Exam items often reward mechanistic reasoning rather than isolated memorization, so we keep the discussion anchored to plausible physiology–pharmacology relationships and common monitoring priorities. Keyword framing for study: ${kw}. Language here is intentionally cautious: individual patients vary, local protocols differ, and bedside decisions must follow licensed scope, orders, and institutional policy.</p>`;
}

export function buildFaq(topic: LongTailTopicSpec): FaqTriple {
  const anchor = esc(topic.anchorLabel);
  return {
    q1: `What is the safest way to study ${anchor} for NCLEX-style questions?`,
    a1: `Use a mechanism-first outline: triggers → compensatory responses → predictable assessment changes → priority interventions → escalation criteria. Pair each concept with one monitoring parameter you would actually trend at the bedside.`,
    q2: `Which misunderstandings about ${anchor} commonly show up on exams?`,
    a2: `Students often over-simplify multi-step pathways or confuse similar presentations across different etiologies. Slow down, separate acute compensation from organ injury, and verify whether the stem is describing onset, trajectory, or complications rather than a single snapshot.`,
    q3: `When should a nurse prioritize escalation over continued routine monitoring for topics like ${anchor}?`,
    a3: `Escalate when trends suggest impending instability: worsening work of breathing, rapidly changing mentation, refractory hypotension, escalating oxygen requirements, new arrhythmias, concerning laboratory trajectories, or any sudden change that does not match the expected course for the current plan of care.`,
  };
}

/** Conservative APA-style strings with real organization URLs (no fabricated journal articles). */
export function buildApaReferences(accessDate: string): string[] {
  return [
    `Centers for Disease Control and Prevention. (2024). Sepsis. Retrieved ${accessDate}, from https://www.cdc.gov/sepsis/index.html`,
    `National Institute of Diabetes and Digestive and Kidney Diseases. (2024). Diabetes. Retrieved ${accessDate}, from https://www.niddk.nih.gov/health-information/diabetes`,
    `MedlinePlus. (2024). Drugs, herbs and supplements. Retrieved ${accessDate}, from https://medlineplus.gov/druginformation.html`,
    `World Health Organization. (2024). Cardiovascular diseases. Retrieved ${accessDate}, from https://www.who.int/health-topics/cardiovascular-diseases`,
    `National Library of Medicine. (2024). NCBI Bookshelf (StatPearls and other books). Retrieved ${accessDate}, from https://www.ncbi.nlm.nih.gov/bookshelf/`,
  ];
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

export function buildLongTailBody(topic: LongTailTopicSpec, internalLinksHtml: string): string {
  const t = esc(topic.title);
  const sys = esc(topic.bodySystem);
  const kind = topic.kind;
  const mechanismHeading =
    kind === "pharmacology" ? "Pharmacology mechanism (exam-oriented)" : "Pathophysiology mechanism (exam-oriented)";
  const faq = buildFaq(topic);

  const pad = (key: string) =>
    `<p>${paragraphBlock(topic, key)} ${paragraphBlock(topic, `${key} (deeper)`)} ${paragraphBlock(
      topic,
      `${key} (application)`,
    )}</p>`;

  const h1 = `<h1>${t}</h1>`;
  const disclaimer = `<p><em>This article is for nursing education and exam preparation, not personal medical advice.</em> It is written for RN, PN/RPN, NP, allied health, and new graduate audiences as a shared learning layer; scope, supervision, and local protocols still define what you may do at the bedside. Always follow orders, scope of practice, facility policy, and local regulations.</p>`;
  const canonicalNote = `<p><strong>Canonical URL path:</strong> <code>${esc(`/blog/${topic.slug}`)}</code> (public article route).</p>`;
  const internal = `<p><strong>Related NurseNest articles.</strong> ${internalLinksHtml}</p>`;

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
    pad("Mechanism narrative"),
    `<h2>Nursing assessment findings</h2>`,
    pad("Assessment clustering"),
    `<h2>Nursing interventions and implications</h2>`,
    pad("Intervention priorities"),
    `<h2>Patient teaching points</h2>`,
    pad("Teaching script"),
    `<h2>RN/NCLEX Focus</h2>`,
    pad("RN prioritization and NCLEX-style traps"),
    `<h2>PN/RPN Focus</h2>`,
    pad("Practical nursing scope and collaborative reporting"),
    `<h2>Advanced NP Considerations</h2>`,
    pad("Diagnostics, prescribing context, and escalation judgment"),
    `<h2>Allied Health Relevance</h2>`,
    pad("Rehabilitation, diagnostics, and interprofessional coordination"),
    `<h2>New graduate nurse focus</h2>`,
    pad("Orientation priorities, safety habits, and preceptor questions"),
    `<h2>NCLEX-style clinical reasoning</h2>`,
    pad("Clinical reasoning drills"),
    `<h2>When to escalate care</h2>`,
    pad("Escalation triggers"),
    `<h2>Frequently asked questions</h2>`,
    `<h3>${esc(faq.q1)}</h3><p>${esc(faq.a1)}</p>`,
    `<h3>${esc(faq.q2)}</h3><p>${esc(faq.a2)}</p>`,
    `<h3>${esc(faq.q3)}</h3><p>${esc(faq.a3)}</p>`,
    `<h2>References (APA-style)</h2>`,
    `<ol><li>${esc(
      "Centers for Disease Control and Prevention. (2024). Sepsis. Retrieved from https://www.cdc.gov/sepsis/index.html",
    )}</li><li>${esc(
      "National Institute of Diabetes and Digestive and Kidney Diseases. (2024). Diabetes. Retrieved from https://www.niddk.nih.gov/health-information/diabetes",
    )}</li><li>${esc(
      "MedlinePlus. (2024). Drugs, herbs and supplements. Retrieved from https://medlineplus.gov/druginformation.html",
    )}</li><li>${esc(
      "World Health Organization. (2024). Cardiovascular diseases. Retrieved from https://www.who.int/health-topics/cardiovascular-diseases",
    )}</li><li>${esc(
      "National Library of Medicine. (2024). NCBI Bookshelf. Retrieved from https://www.ncbi.nlm.nih.gov/bookshelf/",
    )}</li></ol>`,
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
  if (!/frequently asked questions/i.test(html)) reasons.push("missing_faq_heading");
  if ((html.match(/<h3\b/gi) ?? []).length < 3) reasons.push("faq_h3_below_3");
  if (!/references \(apa-style\)/i.test(html)) reasons.push("missing_references_heading");
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
