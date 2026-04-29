/**
 * Strict cross-pathway lesson spine for depth audits and optional deterministic merges.
 * Canonical kinds are a **superset** of premium kinds in `pathway-lesson-premium.ts`; validators accept
 * any `kind` string present in bundled JSON.
 */
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";

/** Required section kinds — one canonical spine for RN, PN, NP, Allied, New Grad. */
export const LESSON_CONTENT_DEPTH_CANONICAL_KINDS = [
  "introduction",
  "pathophysiology_overview",
  "risk_factors",
  "signs_symptoms",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "treatments",
  "pharmacology",
  "clinical_decision_making",
  "complications",
  "clinical_pearls",
  "client_education",
  "case_study",
  "linked_flashcard_prompts",
] as const;

export type LessonContentDepthCanonicalKind = (typeof LESSON_CONTENT_DEPTH_CANONICAL_KINDS)[number];

/** Legacy-only kinds (five-block + exam strip) — must not appear as the sole spine after migration. */
export const LESSON_DEPTH_LEGACY_ONLY_KINDS = [
  "clinical_meaning",
  "core_concept",
  "takeaways",
  "exam_relevance",
  "clinical_scenario",
] as const;

export type LessonDepthLegacyOnlyKind = (typeof LESSON_DEPTH_LEGACY_ONLY_KINDS)[number];

/** Primary canonical bucket each legacy body merges into (deterministic). */
export const LEGACY_KIND_TO_CANONICAL: Record<LessonDepthLegacyOnlyKind, LessonContentDepthCanonicalKind> = {
  clinical_meaning: "introduction",
  core_concept: "pathophysiology_overview",
  exam_relevance: "clinical_decision_making",
  takeaways: "clinical_pearls",
  clinical_scenario: "case_study",
};

/** Minimum plain-text words per canonical section (audit floor — not the same as premium publish gates). */
export const LESSON_DEPTH_MIN_WORDS: Record<LessonContentDepthCanonicalKind, number> = {
  introduction: 120,
  pathophysiology_overview: 100,
  risk_factors: 60,
  signs_symptoms: 80,
  labs_diagnostics: 70,
  nursing_assessment_interventions: 90,
  treatments: 90,
  pharmacology: 70,
  clinical_decision_making: 70,
  complications: 60,
  clinical_pearls: 60,
  client_education: 80,
  case_study: 80,
  linked_flashcard_prompts: 40,
};

export const LESSON_DEPTH_TOTAL_WORD_MIN = 1200;

const GENERIC_FILLER_PATTERNS: RegExp[] = [
  /\bthis is important to know\b/i,
  /\bkey takeaway\b[^.]{0,80}\.$/i,
  /\bmake sure you understand\b/i,
  /\bboards love to test this\b/i,
  /\bhigh-yield topic\b/i,
  /\bbe familiar with\b/i,
  /\bit is essential to\b/i,
  /\bgood luck on your exam\b/i,
];

const PATHO_MECH_RE = /\b(cell|cells|receptor|receptors|mechanism|pathway|cascade|inflammation|hypoxia|ischemia|perfusion|osmosis|electrolyte shift|compensat|dysfunction)\b/i;
const SIGNS_TIMING_RE = /\b(early|later|late onset|progressive|sudden|insidious|red flag|warning sign|deteriorat)\b/i;
const LABS_VALUE_RE = /\b(mmol|meq|mg\/dl|g\/dl|units?\/l|k\+|na\+|cl-|hco3|troponin|lactate|inr|ptt|abg|critical|threshold|reference range)\b/i;
const TREAT_MULT_RE = /\b(medication|pharmac|surgery|procedure|protocol|nursing care|intervention|monitoring|dose|titrat)\b/i;
const EDU_TEACH_RE = /\b(teach-back|teach back|when to (call|seek)|911|emergency department|return if|seek care)\b/i;
const PEARL_GENERIC_RE = /^(important|remember|always|never|key point)[.:]?\s*$/i;

export type LessonDepthCohort = "RN" | "RPN_PN" | "NP" | "ALLIED" | "NEW_GRAD" | "OTHER";

/**
 * Buckets pathway ids for aggregate completion % (bundled catalog only).
 * Order for strict gate: RN → RPN_PN → NP → ALLIED → NEW_GRAD.
 */
export function lessonDepthCohortFromPathwayId(pathwayId: string): LessonDepthCohort {
  const id = pathwayId.trim().toLowerCase();
  if (!id) return "OTHER";
  if (id.includes("new-grad")) return "NEW_GRAD";
  if (id === "us-allied-core" || id === "ca-allied-core" || id.includes("allied")) return "ALLIED";
  if (/-np-/.test(id) || id.startsWith("us-np-") || id.startsWith("ca-np-")) return "NP";
  if (
    id.includes("nclex-pn") ||
    id.includes("rex-pn") ||
    id.includes("lpn-nclex") ||
    /-pn-/.test(id) ||
    id.includes("rpn")
  ) {
    return "RPN_PN";
  }
  if (id.includes("nclex-rn") || (id.includes("-rn-") && !id.includes("np"))) return "RN";
  return "OTHER";
}

export const LESSON_DEPTH_COHORT_ORDER: LessonDepthCohort[] = ["RN", "RPN_PN", "NP", "ALLIED", "NEW_GRAD"];

const LESSON_DEPTH_ROLLUP_COHORTS: readonly LessonDepthCohort[] = [...LESSON_DEPTH_COHORT_ORDER, "OTHER"];

export type LessonContentDepthAnalysis = {
  pathwayId: string;
  slug: string;
  title: string;
  totalWords: number;
  belowWordTotal: boolean;
  /** No section row for this kind, or body is empty. */
  missingKindsStrict: LessonContentDepthCanonicalKind[];
  /** Section exists but is below the minimum word floor for that kind. */
  weakKinds: LessonContentDepthCanonicalKind[];
  legacyOnlyKindsPresent: LessonDepthLegacyOnlyKind[];
  genericFillerHits: string[];
  specificityFailures: string[];
  missingFlashcardSurface: boolean;
  passesAllSchema: boolean;
};

function sectionByKindMap(sections: PathwayLessonSection[]): Map<string, PathwayLessonSection> {
  const m = new Map<string, PathwayLessonSection>();
  for (const s of sections) {
    if (s?.kind && !m.has(s.kind)) m.set(s.kind, s);
  }
  return m;
}

function hasLinkedFlashcardSurface(sections: PathwayLessonSection[]): boolean {
  const sec = sections.find((s) => String(s.kind) === "linked_flashcard_prompts");
  if (sec && countWords(sec.body) >= 20) return true;
  for (const s of sections) {
    const rp = (s as { recallPrompts?: { prompt?: string }[] }).recallPrompts;
    if (Array.isArray(rp) && rp.some((x) => typeof x?.prompt === "string" && x.prompt.trim().length > 10)) {
      return true;
    }
  }
  return false;
}

function detectGenericFiller(body: string): string[] {
  const plain = stripToPlainText(body);
  const hits: string[] = [];
  for (const re of GENERIC_FILLER_PATTERNS) {
    if (re.test(plain)) hits.push(re.source);
  }
  return hits;
}

/** Used by lesson-linked flashcard generation — avoid stems/backs from generic filler prose. */
export function lessonBodyGenericFillerPatternHits(body: string): string[] {
  return detectGenericFiller(body);
}

export function lessonBodyHasGenericFiller(body: string): boolean {
  return detectGenericFiller(body).length > 0;
}

function evaluateSpecificity(kind: LessonContentDepthCanonicalKind, body: string): string[] {
  const plain = stripToPlainText(body);
  const fails: string[] = [];
  if (countWords(plain) < 20) return fails;
  switch (kind) {
    case "pathophysiology_overview":
      if (!PATHO_MECH_RE.test(plain)) fails.push("pathophysiology_overview: add mechanism/cellular or system-level explanation");
      break;
    case "signs_symptoms":
      if (!SIGNS_TIMING_RE.test(plain)) fails.push("signs_symptoms: add early vs late course and/or red flags");
      break;
    case "labs_diagnostics":
      if (!LABS_VALUE_RE.test(plain)) fails.push("labs_diagnostics: add values, units, or escalation/critical thresholds where applicable");
      break;
    case "treatments":
      if (!TREAT_MULT_RE.test(plain)) fails.push("treatments: include medical, pharmacological, and nursing care angles");
      break;
    case "client_education":
      if (!EDU_TEACH_RE.test(plain)) fails.push("client_education: add teach-back and when to seek help / escalate");
      break;
    case "clinical_pearls":
      if (plain.length < 80 || PEARL_GENERIC_RE.test(plain.trim())) {
        fails.push("clinical_pearls: expand with exam-specific, actionable pearls (not generic one-liners)");
      }
      break;
    default:
      break;
  }
  return fails;
}

export function analyzeLessonContentDepth(
  pathwayId: string,
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "sections">,
): LessonContentDepthAnalysis {
  const sections = lesson.sections ?? [];
  const byKind = sectionByKindMap(sections);
  let totalWords = 0;
  const genericFillerHits: string[] = [];
  const specificityFailures: string[] = [];
  const missingKindsStrict: LessonContentDepthCanonicalKind[] = [];
  const weakKinds: LessonContentDepthCanonicalKind[] = [];

  for (const s of sections) {
    totalWords += countWords(s.body);
    genericFillerHits.push(...detectGenericFiller(s.body));
  }

  for (const kind of LESSON_CONTENT_DEPTH_CANONICAL_KINDS) {
    const sec = byKind.get(kind);
    const w = sec ? countWords(sec.body) : 0;
    const min = LESSON_DEPTH_MIN_WORDS[kind];
    if (!sec || w === 0) missingKindsStrict.push(kind);
    else if (w < min) weakKinds.push(kind);
    if (sec && w >= min) specificityFailures.push(...evaluateSpecificity(kind, sec.body));
  }

  const legacyOnlyKindsPresent = LESSON_DEPTH_LEGACY_ONLY_KINDS.filter((k) => byKind.has(k));

  const missingFlashcardSurface = !hasLinkedFlashcardSurface(sections);

  const passesAllSchema =
    missingKindsStrict.length === 0 &&
    weakKinds.length === 0 &&
    specificityFailures.length === 0 &&
    genericFillerHits.length === 0 &&
    !missingFlashcardSurface &&
    totalWords >= LESSON_DEPTH_TOTAL_WORD_MIN;

  return {
    pathwayId,
    slug: lesson.slug,
    title: lesson.title,
    totalWords,
    belowWordTotal: totalWords < LESSON_DEPTH_TOTAL_WORD_MIN,
    missingKindsStrict,
    weakKinds,
    legacyOnlyKindsPresent,
    genericFillerHits: [...new Set(genericFillerHits)],
    specificityFailures,
    missingFlashcardSurface,
    passesAllSchema,
  };
}

function isWeakBody(body: string, kind: LessonContentDepthCanonicalKind): boolean {
  return countWords(body) < LESSON_DEPTH_MIN_WORDS[kind];
}

function mergeBodies(existing: string, addition: string, fromLabel: string): string {
  const a = stripToPlainText(existing);
  const b = stripToPlainText(addition);
  if (!b) return a;
  if (a.includes(b.slice(0, Math.min(80, b.length)))) return a;
  if (!a) return b;
  return `${a}\n\n---\n\n*Merged from legacy (${fromLabel}):*\n\n${b}`;
}

/**
 * Deterministic merge: maps legacy-only kinds into canonical sections, fills missing canonical sections
 * only when the target is empty or below the depth word floor. **Does not delete** existing strong bodies.
 */
export function buildLessonContentDepthFixSections(lesson: PathwayLessonRecord): PathwayLessonSection[] {
  const incoming = [...(lesson.sections ?? [])];
  const byKind = sectionByKindMap(incoming);

  const out = new Map<string, PathwayLessonSection>();

  for (const kind of LESSON_CONTENT_DEPTH_CANONICAL_KINDS) {
    const hit = byKind.get(kind);
    if (hit) {
      out.set(kind, { ...hit, kind: hit.kind as PathwayLessonSection["kind"] });
    } else {
      out.set(kind, {
        id: kind,
        heading: humanHeadingForCanonical(kind),
        kind: kind as unknown as PathwayLessonSection["kind"],
        body: "",
      });
    }
  }

  for (const legacy of LESSON_DEPTH_LEGACY_ONLY_KINDS) {
    const sec = byKind.get(legacy);
    if (!sec?.body?.trim()) continue;
    const target = LEGACY_KIND_TO_CANONICAL[legacy];
    const cur = out.get(target)!;
    if (isWeakBody(cur.body, target)) {
      out.set(target, {
        ...cur,
        body: mergeBodies(cur.body, sec.body, legacy),
        figures: cur.figures ?? sec.figures,
      });
    }
  }

  /** Premium `red_flags` often holds escalation language — fold into signs_symptoms if weak. */
  const red = byKind.get("red_flags");
  const signs = out.get("signs_symptoms")!;
  if (red?.body?.trim() && isWeakBody(signs.body, "signs_symptoms")) {
    out.set("signs_symptoms", {
      ...signs,
      body: mergeBodies(signs.body, red.body, "red_flags"),
    });
  }

  /** `exam_focus` → clinical_decision_making when weak. */
  const ef = incoming.find((s) => s.kind === "exam_focus");
  const cdm = out.get("clinical_decision_making")!;
  if (ef?.body?.trim() && isWeakBody(cdm.body, "clinical_decision_making")) {
    out.set("clinical_decision_making", {
      ...cdm,
      body: mergeBodies(cdm.body, ef.body, "exam_focus"),
    });
  }

  return LESSON_CONTENT_DEPTH_CANONICAL_KINDS.map((k) => out.get(k)!);
}

function humanHeadingForCanonical(kind: LessonContentDepthCanonicalKind): string {
  const labels: Record<LessonContentDepthCanonicalKind, string> = {
    introduction: "Introduction",
    pathophysiology_overview: "Pathophysiology overview",
    risk_factors: "Risk factors",
    signs_symptoms: "Signs and symptoms",
    labs_diagnostics: "Labs and diagnostics",
    nursing_assessment_interventions: "Nursing assessment and interventions",
    treatments: "Treatments",
    pharmacology: "Pharmacology",
    clinical_decision_making: "Clinical decision-making",
    complications: "Complications",
    clinical_pearls: "Clinical pearls",
    client_education: "Client education",
    case_study: "Case study",
    linked_flashcard_prompts: "Linked flashcard prompts",
  };
  return labels[kind];
}

export type CohortDepthRollup = {
  cohort: LessonDepthCohort;
  pathwayIds: string[];
  totalLessons: number;
  passingLessons: number;
  completionPct: number;
};

export function rollupDepthByCohort(analyses: LessonContentDepthAnalysis[]): CohortDepthRollup[] {
  const byCohort = new Map<LessonDepthCohort, { pass: number; total: number; paths: Set<string> }>();
  for (const c of LESSON_DEPTH_ROLLUP_COHORTS) {
    byCohort.set(c, { pass: 0, total: 0, paths: new Set() });
  }

  for (const a of analyses) {
    const cohort = lessonDepthCohortFromPathwayId(a.pathwayId);
    const bucket = byCohort.get(cohort)!;
    bucket.total += 1;
    bucket.paths.add(a.pathwayId);
    if (a.passesAllSchema) bucket.pass += 1;
  }

  const rows: CohortDepthRollup[] = [];
  for (const cohort of LESSON_DEPTH_ROLLUP_COHORTS) {
    const b = byCohort.get(cohort)!;
    const completionPct = b.total === 0 ? 100 : Math.round((1000 * b.pass) / b.total) / 10;
    rows.push({
      cohort,
      pathwayIds: [...b.paths].sort(),
      totalLessons: b.total,
      passingLessons: b.pass,
      completionPct,
    });
  }
  return rows;
}

/**
 * Strict sequential gate: each tier must be 100% before the next is evaluated as "allowed" to be <100%.
 * Returns human-readable violations.
 */
export function evaluateLessonDepthSequentialGate(rollups: CohortDepthRollup[]): string[] {
  const m = new Map(rollups.map((r) => [r.cohort, r]));
  const violations: string[] = [];
  for (let i = 0; i < LESSON_DEPTH_COHORT_ORDER.length; i += 1) {
    const c = LESSON_DEPTH_COHORT_ORDER[i]!;
    const r = m.get(c);
    if (!r || r.totalLessons === 0) continue;
    if (r.completionPct < 100) {
      violations.push(`${c} depth completion is ${r.completionPct}% (${r.passingLessons}/${r.totalLessons}) — required 100% before later cohorts.`);
      break;
    }
  }
  return violations;
}
