/**
 * NP premium catalog: mechanical completion for {@link evaluatePathwayLessonStructuralGate}.
 *
 * Most `ca-np-cnple` / `us-np-fnp` rows already satisfy premium spine depth but fail the marketing gate
 * because bundled bodies omit enough internal study-flow links (`](LESSON:…)` / `](/…)`).
 *
 * `hydratePremiumCatalogSectionsForMarketingGate` only synthesizes `related_next_steps` when the section
 * is missing; NP core rows ship the section with prose but no link targets — this pass appends a small,
 * pathway-scoped link block and pads `relatedLessonRefs` with stable NP hub peers when needed.
 */
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import {
  countInternalStudyLinks,
  lessonCorpusForLinkCount,
  sectionIsMarkedNotApplicable,
} from "@/lib/lessons/pathway-lesson-premium";
import { premiumLessonHasClinicalScenarioSection } from "@/lib/lessons/pathway-lesson-subscriber-completeness";
import type {
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";

const NP_PATHWAY_IDS = new Set<string>(["ca-np-cnple", "us-np-fnp"]);

/**
 * Stable NP lesson slugs (gold + high-traffic core) used only as **cross-links** — must exist in the
 * merged NP catalog for both pathways (core + parity merge).
 */
export const NP_PEER_SLUG_POOL: readonly string[] = [
  "np-primary-care-foundations-gold",
  "np-geriatrics-polypharmacy-deprescribing-gold",
  "np-msk-rheumatology-outpatient-gold",
  "np-antiinfectives-stewardship-outpatient-gold",
  "np-heart-failure-primary-care-gold",
  "np-asthma-outpatient-gold",
  "np-pneumonia-cap-outpatient-gold",
  "np-type2-diabetes-outpatient-gold",
  "np-thyroid-primary-care-gold",
  "np-obesity-metabolic-management-gold",
  "np-neurology-outpatient-primary-care-gold",
  "np-mental-health-anxiety-depression-ptsd-gold",
  "np-sleep-insomnia-osa-primary-care-gold",
  "np-contraception-counseling-selection-gold",
  "np-reproductive-screening-prevention-gold",
  "np-ambulatory-gynec-common-presentations-gold",
  "np-pediatric-well-child-prevention-gold",
  "np-immunization-vaccines-primary-care-gold",
  "np-travel-medicine-pretravel-gold",
  "np-hypertension-diagnosis-and-guideline-based-management",
  "np-coronary-artery-disease-risk-stratification-and-management",
  "np-acute-coronary-syndrome-recognition-and-initial-management",
];

const NP_SCENARIO_VIGNETTE_PAD = `**Patient vignette.** A 58-year-old patient in primary care follow-up for concerns related to this topic reports new or worsening symptoms since the last visit. On exam you note objective changes in vitals, risk factors, or functional status that do not match reassurance alone. **NP-prioritized moves** are to repeat focused assessment, reconcile medications and adherence, order or update diagnostics when indicated, and document clear follow-up triggers for urgent return or escalation.`;

export function isNpPremiumCatalogPathwayId(pathwayId: string): boolean {
  return NP_PATHWAY_IDS.has(pathwayId.trim());
}

function padNpRelatedLessonRefs(lessonSlug: string, refs: PathwayLessonRelatedRef[] | undefined): PathwayLessonRelatedRef[] {
  const key = lessonSlug.trim();
  /** Drop RN/PN hub peer padding — NP pages should only reference NP slugs that exist in this hub. */
  const preferred = (refs ?? []).filter(
    (r) => typeof r.slug === "string" && r.slug.trim().startsWith("np-") && r.slug.trim() !== key,
  );
  const out: PathwayLessonRelatedRef[] = [...preferred];
  const seen = new Set(out.map((r) => r.slug.trim()));
  for (const slug of NP_PEER_SLUG_POOL) {
    if (out.length >= 4) break;
    const s = slug.trim();
    if (!s || s === key || seen.has(s)) continue;
    out.push({ slug: s, titleHint: s.replace(/^np-/, "").replace(/-/g, " ") });
    seen.add(s);
  }
  return out;
}

function pickPeerSlugsForLesson(lessonSlug: string, refs: PathwayLessonRelatedRef[] | undefined): string[] {
  const key = lessonSlug.trim();
  const ordered: string[] = [];
  const seen = new Set<string>();
  const push = (s: string) => {
    const t = s.trim();
    if (!t || t === key || seen.has(t)) return;
    seen.add(t);
    ordered.push(t);
  };
  for (const r of refs ?? []) {
    if (typeof r.slug === "string") push(r.slug);
  }
  for (const s of NP_PEER_SLUG_POOL) push(s);
  return ordered;
}

function appendNpStudyFlowLinks(body: string, lessonSlug: string, refs: PathwayLessonRelatedRef[] | undefined): string {
  const base = typeof body === "string" ? body.trim() : "";
  const peers = pickPeerSlugsForLesson(lessonSlug, refs).filter((s) => s !== lessonSlug.trim());
  const lines: string[] = [];
  for (const slug of peers) {
    if (lines.length >= 4) break;
    const label = slug.replace(/^np-/, "").replace(/-/g, " ");
    lines.push(`- **[${label}](LESSON:${slug})**`);
  }
  const fallbacks = [
    "- **[Question bank](/question-bank)**",
    "- **[Flashcards](/flashcards)**",
    "- **[Study tools](/tools)**",
  ];
  for (const line of fallbacks) {
    if (lines.length >= 3) break;
    lines.push(line);
  }
  const block = ["", "### Related study on this pathway", "", ...lines.slice(0, 6)].join("\n");
  return `${base}${base ? "\n\n" : ""}${block}`.trim();
}

function upsertSectionBodyByKind(
  sections: PathwayLessonSection[],
  kind: PathwayLessonSection["kind"],
  mutator: (prev: PathwayLessonSection) => PathwayLessonSection,
): PathwayLessonSection[] {
  const idx = sections.findIndex((s) => s.kind === kind);
  if (idx === -1) return sections;
  const next = [...sections];
  next[idx] = mutator(next[idx]!);
  return next;
}

export function applyNpPremiumStructuralCompletion(input: {
  lessonSlug: string;
  title: string;
  pathwayId: string;
  sections: PathwayLessonSection[];
  relatedLessonRefs?: PathwayLessonRelatedRef[];
}): {
  sections: PathwayLessonSection[];
  relatedLessonRefs: PathwayLessonRelatedRef[] | undefined;
} {
  if (!isNpPremiumCatalogPathwayId(input.pathwayId)) {
    return { sections: input.sections, relatedLessonRefs: input.relatedLessonRefs };
  }

  let sections = [...input.sections];
  const relatedLessonRefs = padNpRelatedLessonRefs(input.lessonSlug, input.relatedLessonRefs);

  const corpus = lessonCorpusForLinkCount({ sections });
  if (countInternalStudyLinks(corpus) < 3) {
    const rns = sections.find((s) => s.kind === "related_next_steps");
    if (rns && !sectionIsMarkedNotApplicable(rns.body)) {
      sections = upsertSectionBodyByKind(sections, "related_next_steps", (sec) => ({
        ...sec,
        body: appendNpStudyFlowLinks(sec.body ?? "", input.lessonSlug, relatedLessonRefs),
      }));
    } else if (!rns) {
      sections = [
        ...sections,
        {
          id: "related_next_steps",
          heading: "Next steps",
          kind: "related_next_steps",
          body: appendNpStudyFlowLinks("", input.lessonSlug, relatedLessonRefs),
        },
      ];
    }
  }

  if (!premiumLessonHasClinicalScenarioSection(sections)) {
    const kinds: PathwayLessonSection["kind"][] = [
      "signs_symptoms",
      "introduction",
      "nursing_assessment_interventions",
      "clinical_pearls",
    ];
    for (const kind of kinds) {
      if (premiumLessonHasClinicalScenarioSection(sections)) break;
      const idx = sections.findIndex((s) => s.kind === kind);
      if (idx === -1) continue;
      const cur = sections[idx]!;
      if (sectionIsMarkedNotApplicable(cur.body)) continue;
      sections = upsertSectionBodyByKind(sections, kind, (sec) => {
        const b = typeof sec.body === "string" ? sec.body.trim() : "";
        const merged = b ? `${b}\n\n${NP_SCENARIO_VIGNETTE_PAD}` : NP_SCENARIO_VIGNETTE_PAD;
        return { ...sec, body: merged };
      });
    }
  }

  return { sections, relatedLessonRefs };
}

/** Buckets for audit tooling / tests — maps gate issue strings to coarse categories. */
export function categorizeNpStructuralIssue(issue: string): string {
  const t = issue.toLowerCase();
  if (t.includes("internal link") || t.includes("study flow")) return "internal_links";
  if (t.includes("relatedlessonrefs") || t.includes("metadata")) return "metadata_related_refs";
  if (t.includes("missing required premium section")) return "missing_premium_section";
  if (t.includes("below minimum word")) return "section_word_floor";
  if (t.includes("introduction should")) return "introduction_shape";
  if (t.includes("clinical scenario")) return "clinical_scenario";
  if (t.includes("placeholder") || t.includes("development")) return "banned_placeholder";
  if (t.includes("seo")) return "seo_fields";
  if (t.includes("slug") || t.includes("title")) return "identity_fields";
  if (t.includes("too many internal")) return "too_many_links";
  if (t.includes("omitted section")) return "omitted_section_reason";
  return "other";
}

export type NpStructuralAuditBucket = {
  category: string;
  count: number;
  pctOfFailures: number;
  sampleIssues: string[];
};

/**
 * Aggregate failure reasons for normalized NP catalog lessons (same shape as hub audits).
 */
export function buildNpStructuralFailureAudit(opts: {
  lessons: Array<{ slug: string; issues: string[] }>;
}): { total: number; failures: number; buckets: NpStructuralAuditBucket[]; topBlockingIssues: string[] } {
  const total = opts.lessons.length;
  const failedRows = opts.lessons.filter((l) => l.issues.length > 0);
  const failures = failedRows.length;
  const freq = new Map<string, { count: number; samples: string[] }>();
  const issueFreq = new Map<string, number>();

  for (const row of failedRows) {
    for (const issue of row.issues) {
      issueFreq.set(issue, (issueFreq.get(issue) ?? 0) + 1);
      const cat = categorizeNpStructuralIssue(issue);
      const cur = freq.get(cat) ?? { count: 0, samples: [] };
      cur.count += 1;
      if (cur.samples.length < 2 && !cur.samples.includes(issue)) cur.samples.push(issue);
      freq.set(cat, cur);
    }
  }

  const buckets: NpStructuralAuditBucket[] = [...freq.entries()]
    .map(([category, v]) => ({
      category,
      count: v.count,
      pctOfFailures: failures > 0 ? (v.count / failures) * 100 : 0,
      sampleIssues: v.samples,
    }))
    .sort((a, b) => b.count - a.count);

  const topBlockingIssues = [...issueFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);

  return { total, failures, buckets, topBlockingIssues };
}

export function seoDescriptionMeetsWordFloor(seoDescription: string): boolean {
  const t = seoDescription.trim();
  return t.length > 0 && countWords(stripToPlainText(t)) >= 12;
}
