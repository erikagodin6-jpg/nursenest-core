import { buildTaxonomySeoBreadcrumbs } from "@/lib/seo/breadcrumbs";
import {
  assertSeoCategoryDomainAlignment,
  type SeoContentDomain,
  type SeoTier,
} from "@/lib/seo/seo-taxonomy-align";

const MODIFIERS = ["Explained", "Guide", "NCLEX Review", "What Nurses Must Know"] as const;

export type GenerateSeoInput = {
  title: string;
  category: string;
  domain: SeoContentDomain;
  keywords?: string[];
  tier: SeoTier;
};

export type GenerateSeoFaqItem = { q: string; a: string };

export type GenerateSeoResult = {
  /** Terminal topic slug (kebab-case). Uniqueness is enforced at persistence time (see `seo-duplicate-guard.ts`). */
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  breadcrumb: string[];
  faq: GenerateSeoFaqItem[];
};

function slugifySegment(raw: string, maxLen = 72): string {
  const s = raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
  return s.length >= 3 ? s : "nursing-topic";
}

function pickModifier(seed: string): (typeof MODIFIERS)[number] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return MODIFIERS[h % MODIFIERS.length];
}

function primaryPhrase(title: string, keywords: readonly string[] | undefined): string {
  const kw = (keywords ?? []).map((k) => k.trim()).find((k) => k.length >= 3);
  if (kw) return kw.slice(0, 80);
  const cleaned = title.replace(/\s+/g, " ").trim();
  return cleaned.slice(0, 80) || "nursing topic";
}

function clampLen(s: string, min: number, max: number): string {
  let t = s.replace(/\s+/g, " ").trim();
  if (t.length > max) {
    const slice = t.slice(0, max - 1);
    const sp = slice.lastIndexOf(" ");
    t = sp > min * 0.55 ? slice.slice(0, sp) : slice;
  }
  while (t.length < min && t.length < max) {
    t = `${t}`.trim();
    break;
  }
  return t.slice(0, max);
}

function keywordInFirstHalf(metaTitle: string, keyword: string): boolean {
  const mid = Math.floor(metaTitle.length / 2);
  const head = metaTitle.slice(0, Math.max(mid, 1)).toLowerCase();
  return head.includes(keyword.toLowerCase());
}

function buildMetaTitle(keyword: string, modifier: string, tier: SeoTier): string {
  const core = `${keyword} ${modifier} (${tier})`.replace(/\s+/g, " ").trim();
  let out = clampLen(core, 55, 65);
  if (!keywordInFirstHalf(out, keyword)) {
    out = clampLen(`${keyword}: ${modifier} (${tier})`.replace(/\s+/g, " ").trim(), 55, 65);
  }
  let guard = 0;
  while (out.length < 55 && guard++ < 12) {
    out = `${out} | NurseNest`.replace(/\s+/g, " ").trim().slice(0, 65);
  }
  return clampLen(out, 55, 65);
}

function buildH1(title: string, keyword: string, metaTitle: string): string {
  const base = title.replace(/\s+/g, " ").trim().slice(0, 120);
  let candidate =
    base.length >= 12 && base.toLowerCase() !== keyword.toLowerCase()
      ? clampLen(`${base} — clinical overview`, 24, 110)
      : clampLen(`Nursing overview: ${keyword}`, 24, 110);
  if (candidate.replace(/\s+/g, " ").trim().toLowerCase() === metaTitle.replace(/\s+/g, " ").trim().toLowerCase()) {
    candidate = clampLen(`${keyword} — what to study first`, 24, 110);
  }
  return candidate;
}

function buildMetaDescription(keyword: string, tier: SeoTier, domain: SeoContentDomain): string {
  const benefit =
    domain === "CLINICAL"
      ? "priority cues, red flags, and safe interventions"
      : domain === "PHARMACOLOGY"
        ? "drug-class actions, monitoring, and exam-style safety checks"
        : domain === "PROFESSIONAL_PRACTICE"
          ? "scope-safe practice, communication, and documentation habits"
          : "test-taking discipline, elimination, and study structure";
  const outcome =
    domain === "CLINICAL"
      ? "apply pathophysiology to bedside decisions on exams"
      : domain === "PHARMACOLOGY"
        ? "answer pharmacology items with confidence"
        : domain === "PROFESSIONAL_PRACTICE"
          ? "reduce legal-ethical and delegation errors"
          : "improve accuracy under time pressure";
  let raw = `${keyword} explained for ${tier}. Learn ${benefit} and ${outcome}.`.replace(/\s+/g, " ").trim();
  const pad = " Use NurseNest drills to reinforce decision rules safely.";
  while (raw.length < 140) {
    raw = (raw + pad).replace(/\s+/g, " ").trim();
  }
  return clampLen(raw, 140, 155);
}

function buildFaq(keyword: string, domain: SeoContentDomain): GenerateSeoFaqItem[] {
  const k = keyword;
  if (domain === "CLINICAL") {
    return [
      {
        q: `What should nurses know first about ${k}?`,
        a: `Start with how ${k} changes perfusion, workload, or risk for complications. Link symptoms to assessment findings, then map the safest nursing priorities before treatments. This page summarizes the high-yield exam framing so you can recognize patterns quickly.`,
      },
      {
        q: `What are early warning signs related to ${k}?`,
        a: `Focus on trends in vitals, mental status, breathing work, and perfusion. Early cues often show up before labs fully change. Use the sections above as a checklist you can scan during practice questions.`,
      },
      {
        q: `How does ${k} show up on NCLEX-style questions?`,
        a: `Expect prioritization, therapeutic communication boundaries, and safe delegation when stability is uncertain. Questions reward the least harmful next step and clear monitoring plans rather than memorized trivia.`,
      },
      {
        q: `What is the biggest mistake students make with ${k}?`,
        a: `Treating ${k} like a vocabulary topic instead of a decision chain. Build a simple if-then story: unstable findings first, then interventions that protect airway, breathing, circulation, and safety.`,
      },
    ];
  }
  if (domain === "PHARMACOLOGY") {
    return [
      {
        q: `What is the nursing priority when giving medications related to ${k}?`,
        a: `Verify indications, contraindications, and monitoring before administration. Focus on adverse-effect recognition and what to report early. This guide highlights the exam-ready monitoring pairs students miss most often.`,
      },
      {
        q: `Which assessments matter most for ${k}?`,
        a: `Pair vitals and symptom trends with labs when applicable. Emphasize airway protection, sedation level, renal function, and bleeding risk depending on the drug class. Use the outline as a bedside-to-exam bridge.`,
      },
      {
        q: `How do I avoid “sound-alike” trap answers for ${k}?`,
        a: `Read stems for stability clues, then eliminate options that skip monitoring or escalate risk. Pharmacology items reward the safest sequence: assess, intervene, then evaluate.`,
      },
    ];
  }
  if (domain === "PROFESSIONAL_PRACTICE") {
    return [
      {
        q: `Why does ${k} matter for safe nursing practice?`,
        a: `It shapes boundaries for scope, delegation, documentation, and communication. Exam questions often test what to do when roles conflict or information is incomplete, so clarity protects patients and your license.`,
      },
      {
        q: `What is a practical way to apply ${k} on the floor?`,
        a: `Use structured handoffs, explicit supervision expectations, and careful charting when risk rises. Translate policy language into a short checklist you can reuse during simulations.`,
      },
      {
        q: `How is ${k} tested on licensure exams?`,
        a: `Expect ethical prioritization, therapeutic communication limits, and legal duties framed as scenarios. Choose answers that maintain patient dignity, informed consent, and continuity of care.`,
      },
    ];
  }
  return [
    {
      q: `How should I study ${k} efficiently?`,
      a: `Use short active-recall bursts, mixed practice, and error logs. Tie each study block to one measurable outcome like faster elimination on items or fewer careless misreads.`,
    },
    {
      q: `What is the fastest way to improve accuracy under time pressure?`,
      a: `Train a repeatable read order: last line first, then safety cues, then distractors. Practice saying the rationale in one sentence to reduce hesitation.`,
    },
    {
      q: `How do I know I am ready to move on from ${k}?`,
      a: `When you can explain the concept without notes and answer variants that swap one stable detail, you are ready. Revisit missed items after a spaced interval to cement retention.`,
    },
  ];
}

/**
 * Deterministic SEO bundle aligned with `src/lib/taxonomy/*` leaf ids.
 * @throws {@link import("@/lib/seo/seo-taxonomy-align").SeoTaxonomyMismatchError} when `domain` does not match `category`.
 */
export function generateSeo(input: GenerateSeoInput): GenerateSeoResult {
  assertSeoCategoryDomainAlignment(input.category, input.domain);
  const keyword = primaryPhrase(input.title, input.keywords);
  const modifier = pickModifier(`${input.title}|${input.category}`);
  const metaTitle = buildMetaTitle(keyword, modifier, input.tier);
  const h1 = buildH1(input.title, keyword, metaTitle);
  if (h1.replace(/\s+/g, " ").trim().toLowerCase() === metaTitle.replace(/\s+/g, " ").trim().toLowerCase()) {
    throw new Error("seo: H1 must not equal metaTitle; adjust title/keyword inputs.");
  }
  const metaDescription = buildMetaDescription(keyword, input.tier, input.domain);
  const slug = slugifySegment(`${keyword}`.replace(/-+/g, "-")).slice(0, 80);
  const topicShort = keyword.slice(0, 80);
  const breadcrumb = buildTaxonomySeoBreadcrumbs({
    tier: input.tier,
    category: input.category,
    domain: input.domain,
    topicShort,
  });
  const faq = buildFaq(keyword, input.domain);
  return { slug, metaTitle, metaDescription, h1, breadcrumb, faq };
}

/** Minimum viable SEO fields for “no SEO = no page” gates. */
export function assertRequiredSeoFieldsPresent(row: {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string[];
}): void {
  if (!row.slug?.trim()) throw new Error("seo: slug is required.");
  if (!row.metaTitle?.trim()) throw new Error("seo: metaTitle is required.");
  if (!row.metaDescription?.trim()) throw new Error("seo: metaDescription is required.");
  if (!row.breadcrumb?.length) throw new Error("seo: breadcrumb is required.");
}
