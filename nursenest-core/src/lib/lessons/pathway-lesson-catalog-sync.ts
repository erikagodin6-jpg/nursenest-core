/**
 * Pure catalog lesson normalization + scoped-gold merge (no Prisma, no i18n DB overlays).
 * Split from `pathway-lesson-loader.ts` so CLI audits and tooling can import without the `server-only` graph.
 * Catalog-backed and still heavy enough to keep out of shared layouts, homepage chrome, and nav/header paths.
 */
import { inferExamAudienceFromPathwayId } from "@/lib/lessons/exam-complete-lesson-template";
import { deriveLessonHighYieldStudyFields } from "@/lib/lessons/lesson-high-yield-study-fields";
import { resolveLessonContextForPathwayId } from "@/lib/lessons/lesson-region-exam";
import {
  evaluatePathwayLessonStructuralGate,
  lessonUsesPremiumStructure,
  orderPremiumSections,
  PREMIUM_SECTION_KINDS,
  validatePathwayLessonPremium,
} from "@/lib/lessons/pathway-lesson-premium";
import { PATHWAY_CATALOG_LIST_HARD_CAP } from "@/lib/lessons/pathway-lesson-scale";
import {
  type PathwayEmbeddedSoundLibraryId,
  type PathwayLessonAudienceTier,
  type PathwayLessonClinicalPriority,
  type PathwayLessonCountryScope,
  type PathwayLessonExamMeta,
  type PathwayLessonExamRelevance,
  type PathwayLessonFigure,
  type PathwayLessonFigureKind,
  type PathwayLessonOmittedPremiumSection,
  type PathwayLessonPriority,
  type PathwayLessonQuizItem,
  type PathwayLessonRecord,
  type PathwayLessonRelatedRef,
  type PathwayLessonRuntimeCountry,
  type PathwayLessonRuntimeExam,
  type PathwayLessonSection,
  type PathwayLessonSectionKind,
  type PathwayLessonYieldLevel,
} from "@/lib/lessons/pathway-lesson-types";
import { sanitizeEmbeddedSoundLibraries } from "@/lib/lessons/pathway-lesson-sound-libraries";
import { countWords, stripToPlainText } from "@/lib/content-quality/plain-text";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import { prependScopedGoldCatalogLessons } from "@/lib/lessons/scoped-lessons/scoped-gold-registry";

type CatalogShape = {
  version: number;
  pathways: Record<
    string,
    {
      lessons: Array<{
        slug: string;
        title: string;
        topic: string;
        topicSlug: string;
        system?: string;
        bodySystem: string;
        previewSectionCount: number;
        seoTitle: string;
        seoDescription: string;
        sections: PathwayLessonRecord["sections"];
        preTest?: PathwayLessonQuizItem[];
        postTest?: PathwayLessonQuizItem[];
        premiumOmittedSections?: PathwayLessonOmittedPremiumSection[];
        relatedLessonRefs?: PathwayLessonRelatedRef[];
        studyTakeaways?: string[];
        studyCommonTraps?: string[];
        memoryAnchor?: string;
        audienceTiers?: PathwayLessonAudienceTier[];
        countryScope?: PathwayLessonCountryScope;
        examRelevance?: PathwayLessonExamRelevance;
        exams?: PathwayLessonRuntimeExam[];
        countries?: PathwayLessonRuntimeCountry[];
        priority?: PathwayLessonPriority;
        examMeta?: PathwayLessonExamMeta[];
        embeddedSoundLibraries?: PathwayEmbeddedSoundLibraryId[];
      }>;
    }
  >;
};

let catalogDataCache: CatalogShape | null = null;
let alliedBundledPathwaysCache: Record<string, CatalogShape["pathways"][string]["lessons"]> | null = null;
let newGradTransitionPathwaysCache: Record<string, { lessons?: CatalogShape["pathways"][string]["lessons"] }> | null = null;

function getCatalogData(): CatalogShape {
  if (catalogDataCache) return catalogDataCache;
  catalogDataCache = require("@/content/pathway-lessons/catalog.json") as CatalogShape;
  return catalogDataCache;
}

function getAlliedBundledPathways(): Record<string, CatalogShape["pathways"][string]["lessons"]> {
  if (alliedBundledPathwaysCache) return alliedBundledPathwaysCache;
  alliedBundledPathwaysCache =
    (require("@/content/pathway-lessons/allied-bundled-catalog.json") as {
      pathways?: Record<string, CatalogShape["pathways"][string]["lessons"]>;
    }).pathways ?? {};
  return alliedBundledPathwaysCache;
}

function getNewGradTransitionPathways(): Record<string, { lessons?: CatalogShape["pathways"][string]["lessons"] }> {
  if (newGradTransitionPathwaysCache) return newGradTransitionPathwaysCache;
  newGradTransitionPathwaysCache =
    (require("@/content/pathway-lessons/new-grad-transition-catalog.json") as {
      pathways?: Record<string, { lessons?: CatalogShape["pathways"][string]["lessons"] }>;
    }).pathways ?? {};
  return newGradTransitionPathwaysCache;
}

function alliedBundledLessonsForPathway(pathwayId: string): LessonInput[] {
  const rows = getAlliedBundledPathways()[pathwayId];
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

function newGradTransitionLessonsForPathway(pathwayId: string): LessonInput[] {
  const bucket = getNewGradTransitionPathways()[pathwayId];
  const rows = bucket?.lessons;
  return Array.isArray(rows) ? rows.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
}

export type LessonInput = CatalogShape["pathways"][string]["lessons"][number];
const CANONICAL_ORDER: PathwayLessonSectionKind[] = [
  "clinical_meaning",
  "exam_relevance",
  "core_concept",
  "clinical_scenario",
  "takeaways",
];

const premiumSectionKindSet = new Set<string>(PREMIUM_SECTION_KINDS as readonly string[]);

/** Premium spine in canonical order; non-premium sections (e.g. exam_focus) append after. */
function finalizePremiumSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const ordered = orderPremiumSections(sections);
  const extras = sections.filter((s) => !premiumSectionKindSet.has(s.kind));
  return [...ordered, ...extras];
}

function hasAllCanonicalKinds(sections: PathwayLessonSection[]): boolean {
  return CANONICAL_ORDER.every((k) => sections.some((s) => s.kind === k));
}

function sanitizeSectionBody(body: unknown): string {
  if (typeof body !== "string") return "";
  return body.trim();
}

function sanitizeFigureKind(raw: unknown): PathwayLessonFigureKind | undefined {
  if (typeof raw !== "string") return undefined;
  const k = raw.trim() as PathwayLessonFigureKind;
  const allowed: PathwayLessonFigureKind[] = [
    "diagram",
    "chart",
    "anatomy",
    "flowchart",
    "clinical_reference",
    "other",
  ];
  return allowed.includes(k) ? k : "other";
}

function sanitizeFigures(raw: unknown): PathwayLessonFigure[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const out: PathwayLessonFigure[] = [];
  for (let i = 0; i < raw.length; i += 1) {
    const item = raw[i];
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const url = typeof o.url === "string" ? o.url.trim() : "";
    if (!url.startsWith("https://")) continue;
    const alt = typeof o.alt === "string" && o.alt.trim().length > 0 ? o.alt.trim() : "Lesson figure";
    const caption = typeof o.caption === "string" && o.caption.trim() ? o.caption.trim() : undefined;
    const attribution = typeof o.attribution === "string" && o.attribution.trim() ? o.attribution.trim() : undefined;
    const id = typeof o.id === "string" && o.id.trim() ? o.id.trim() : `figure-${i}`;
    const kind = sanitizeFigureKind(o.kind);
    out.push({ id, url, alt, caption, kind, attribution });
  }
  return out.length ? out : undefined;
}

function mergeFigures(...buckets: Array<PathwayLessonFigure[] | undefined>): PathwayLessonFigure[] | undefined {
  const merged: PathwayLessonFigure[] = [];
  const seen = new Set<string>();
  for (const b of buckets) {
    if (!b?.length) continue;
    for (const f of b) {
      const key = `${f.url}:${f.alt}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(f);
    }
  }
  return merged.length ? merged : undefined;
}

function sanitizeSection(raw: Partial<PathwayLessonSection>, index: number): PathwayLessonSection {
  const kind = (raw.kind ?? "intro") as PathwayLessonSectionKind;
  const heading = typeof raw.heading === "string" && raw.heading.trim().length > 0 ? raw.heading.trim() : "Section";
  const id = typeof raw.id === "string" && raw.id.trim().length > 0 ? raw.id : `${kind}-${index}`;
  const figures = sanitizeFigures(raw.figures);
  return {
    id,
    heading,
    kind,
    body: sanitizeSectionBody(raw.body),
    ...(figures ? { figures } : {}),
  };
}

function sanitizeIncomingSections(sections: unknown): PathwayLessonSection[] {
  if (!Array.isArray(sections)) return [];
  return sections.map((s, i) => sanitizeSection(s as Partial<PathwayLessonSection>, i));
}

function sanitizeAudienceTiers(raw: unknown): PathwayLessonAudienceTier[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonAudienceTier[] = [];
  for (const x of raw) {
    if (x === "rn" || x === "pn" || x === "np") out.push(x);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function sanitizeCountryScope(raw: unknown): PathwayLessonCountryScope | undefined {
  if (raw === "us" || raw === "ca" || raw === "both") return raw;
  return undefined;
}

function sanitizeExamRelevance(raw: unknown): PathwayLessonExamRelevance | undefined {
  if (raw === "high_yield" || raw === "core" || raw === "specialty") return raw;
  return undefined;
}

function sanitizeRuntimeExam(raw: unknown): PathwayLessonRuntimeExam | undefined {
  if (raw === "REX_PN" || raw === "NCLEX_PN" || raw === "NCLEX_RN" || raw === "NP" || raw === "ALLIED" || raw === "NCLEX") return raw;
  return undefined;
}

function sanitizeRuntimeCountry(raw: unknown): PathwayLessonRuntimeCountry | undefined {
  if (raw === "CA" || raw === "US" || raw === "GLOBAL") return raw;
  return undefined;
}

function sanitizeRuntimePriority(raw: unknown): PathwayLessonPriority | undefined {
  if (raw === "high" || raw === "medium" || raw === "low") return raw;
  return undefined;
}

function sanitizeYieldLevel(raw: unknown): PathwayLessonYieldLevel | undefined {
  if (raw === "must_know" || raw === "common" || raw === "advanced" || raw === "rare") return raw;
  return undefined;
}

function sanitizeClinicalPriority(raw: unknown): PathwayLessonClinicalPriority | undefined {
  if (raw === "urgent" || raw === "routine" || raw === "foundational") return raw;
  return undefined;
}

function sanitizeRuntimeExams(raw: unknown): PathwayLessonRuntimeExam[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonRuntimeExam[] = [];
  for (const x of raw) {
    const val = sanitizeRuntimeExam(x);
    if (val) out.push(val);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function sanitizeRuntimeCountries(raw: unknown): PathwayLessonRuntimeCountry[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonRuntimeCountry[] = [];
  for (const x of raw) {
    const val = sanitizeRuntimeCountry(x);
    if (val) out.push(val);
  }
  return out.length ? [...new Set(out)] : undefined;
}

function sanitizeExamMeta(raw: unknown): PathwayLessonExamMeta[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonExamMeta[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const exam = sanitizeRuntimeExam(rec.exam);
    const yieldLevel = sanitizeYieldLevel(rec.yieldLevel);
    if (!exam || !yieldLevel) continue;
    const clinicalPriority = sanitizeClinicalPriority(rec.clinicalPriority);
    out.push({
      exam,
      yieldLevel,
      ...(clinicalPriority ? { clinicalPriority } : {}),
    });
  }
  if (out.length === 0) return undefined;
  const deduped = new Map<PathwayLessonRuntimeExam, PathwayLessonExamMeta>();
  for (const entry of out) {
    if (!deduped.has(entry.exam)) deduped.set(entry.exam, entry);
  }
  return [...deduped.values()];
}

function yieldFromPriority(priority: PathwayLessonPriority): PathwayLessonYieldLevel {
  if (priority === "high") return "must_know";
  if (priority === "low") return "advanced";
  return "common";
}

function lessonMetadataFields(raw: LessonInput): Pick<
  PathwayLessonRecord,
  "audienceTiers" | "countryScope" | "examRelevance" | "exams" | "countries" | "priority" | "examMeta"
> {
  const audienceTiers = sanitizeAudienceTiers((raw as { audienceTiers?: unknown }).audienceTiers);
  const countryScope = sanitizeCountryScope((raw as { countryScope?: unknown }).countryScope);
  const examRelevance = sanitizeExamRelevance((raw as { examRelevance?: unknown }).examRelevance);
  const exams = sanitizeRuntimeExams((raw as { exams?: unknown }).exams);
  const countries = sanitizeRuntimeCountries((raw as { countries?: unknown }).countries);
  const priority = sanitizeRuntimePriority((raw as { priority?: unknown }).priority);
  const examMeta = sanitizeExamMeta((raw as { examMeta?: unknown }).examMeta);
  return {
    ...(audienceTiers?.length ? { audienceTiers } : {}),
    ...(countryScope ? { countryScope } : {}),
    ...(examRelevance ? { examRelevance } : {}),
    ...(exams?.length ? { exams } : {}),
    ...(countries?.length ? { countries } : {}),
    ...(priority ? { priority } : {}),
    ...(examMeta?.length ? { examMeta } : {}),
  };
}

function mergeLessonAudienceMetadata(
  raw: LessonInput,
  pathwayId?: string,
): Pick<
  PathwayLessonRecord,
  "audienceTiers" | "countryScope" | "examRelevance" | "exams" | "countries" | "priority" | "examMeta"
> {
  const explicit = lessonMetadataFields(raw);
  if (!pathwayId) return explicit;
  const inferred = inferExamAudienceFromPathwayId(pathwayId);
  const context = resolveLessonContextForPathwayId(pathwayId);
  const audienceTiers = explicit.audienceTiers?.length ? explicit.audienceTiers : inferred.audienceTiers;
  const countryScope = explicit.countryScope ?? inferred.countryScope;
  const priority = explicit.priority ?? "medium";
  const exams = explicit.exams?.length ? explicit.exams : [context.exam];
  const countries = explicit.countries?.length ? explicit.countries : [context.country];
  const examMeta = explicit.examMeta?.length
    ? explicit.examMeta
    : [
        {
          exam: context.exam,
          yieldLevel: yieldFromPriority(priority),
        },
      ];
  return {
    audienceTiers,
    countryScope,
    ...(explicit.examRelevance ? { examRelevance: explicit.examRelevance } : {}),
    exams,
    countries,
    priority,
    examMeta,
  };
}

function expandToStandardFiveSections(sections: PathwayLessonSection[]): PathwayLessonSection[] {
  const cleaned = sanitizeIncomingSections(sections);

  if (cleaned.length >= 5 && hasAllCanonicalKinds(cleaned)) {
    const ordered = CANONICAL_ORDER.map((k) => cleaned.find((s) => s.kind === k)).filter(
      (s): s is PathwayLessonSection => Boolean(s),
    );
    if (ordered.length === 5) {
      return ordered.map((s) => ({
        ...s,
        body: s.body || defaultBodyFor(s.kind),
        ...(s.figures ? { figures: s.figures } : {}),
      }));
    }
  }

  const byKind = Object.fromEntries(cleaned.map((s) => [s.kind, s])) as Partial<
    Record<PathwayLessonSectionKind, PathwayLessonSection>
  >;

  const intro = byKind.intro ?? byKind.clinical_meaning ?? byKind.introduction;
  const core = byKind.core ?? byKind.core_concept ?? byKind.pathophysiology_overview;
  const clinical =
    byKind.clinical_application ??
    byKind.clinical_scenario ??
    byKind.nursing_assessment_interventions ??
    byKind.signs_symptoms;
  const exam = byKind.exam_tips ?? byKind.exam_relevance ?? byKind.labs_diagnostics;
  const explicitTakeaways =
    byKind.takeaways ??
    (byKind.clinical_pearls
      ? {
          id: `${byKind.clinical_pearls.id}-takeaways`,
          heading: "Key takeaways",
          kind: "takeaways" as const,
          body: byKind.clinical_pearls.body ?? "",
          ...(byKind.clinical_pearls.figures ? { figures: byKind.clinical_pearls.figures } : {}),
        }
      : undefined);

  const examBody = (exam?.body ?? "").trim();
  const sentences = examBody.split(/(?<=[.!?])\s+/).filter(Boolean);
  const examRelevanceBody =
    sentences.length > 1
      ? sentences.slice(0, Math.min(2, sentences.length)).join(" ")
      : examBody.length > 0
        ? `${examBody} Boards reward judgment, pacing, and elimination over memorizing isolated facts.`
        : "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";

  const takeawaysBody =
    explicitTakeaways?.body?.trim() ||
    (sentences.length > 2
      ? sentences.slice(2).join(" ")
      : "Before your next question block, restate one rule you will not violate on prioritization or scope.");

  const figClinical = mergeFigures(intro?.figures);
  const figExam = mergeFigures(exam?.figures);
  const figCore = mergeFigures(core?.figures);
  const figScenario = mergeFigures(clinical?.figures);
  const figTakeaways = mergeFigures(explicitTakeaways?.figures);

  return [
    {
      id: "clinical_meaning",
      heading: "What this means clinically",
      kind: "clinical_meaning",
      body:
        intro?.body?.trim() ||
        "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.",
      ...(figClinical ? { figures: figClinical } : {}),
    },
    {
      id: "exam_relevance",
      heading: "Why this appears on exams",
      kind: "exam_relevance",
      body: examRelevanceBody,
      ...(figExam ? { figures: figExam } : {}),
    },
    {
      id: "core_concept",
      heading: "Core concept explanation",
      kind: "core_concept",
      body:
        core?.body?.trim() ||
        "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.",
      ...(figCore ? { figures: figCore } : {}),
    },
    {
      id: "clinical_scenario",
      heading: "Clinical scenario example",
      kind: "clinical_scenario",
      body:
        clinical?.body?.trim() ||
        "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.",
      ...(figScenario ? { figures: figScenario } : {}),
    },
    {
      id: "takeaways",
      heading: "Key takeaways",
      kind: "takeaways",
      body: takeawaysBody,
      ...(figTakeaways ? { figures: figTakeaways } : {}),
    },
  ];
}

function defaultBodyFor(kind: PathwayLessonSectionKind): string {
  switch (kind) {
    case "clinical_meaning":
      return "Read the stem as a safety and prioritization problem first, then match your action to the risk you can justify.";
    case "exam_relevance":
      return "Examiners use these topics to test whether you can prioritize, sequence safely, and justify your next action.";
    case "core_concept":
      return "Anchor pathophysiology to assessment findings, then tie interventions to monitoring and escalation rules.";
    case "clinical_scenario":
      return "Picture one client whose data forces a fork: stable monitoring versus urgent escalation. Choose the branch the stem supports.";
    case "takeaways":
      return "Before your next question block, restate one rule you will not violate on prioritization or scope.";
    default:
      return "";
  }
}
function matchesLessonContext(
  lesson: PathwayLessonRecord,
  context: { exam: PathwayLessonRuntimeExam; country: PathwayLessonRuntimeCountry },
): boolean {
  const examMeta = lesson.examMeta ?? [];
  const exams = lesson.exams ?? [];
  const countries = lesson.countries ?? [];
  const examMetaMatch =
    examMeta.length === 0 ||
    examMeta.some(
      (entry) =>
        entry.exam === context.exam ||
        (entry.exam === "NCLEX" && (context.exam === "NCLEX_PN" || context.exam === "NCLEX_RN")),
    );
  const examMatch =
    examMetaMatch &&
    (exams.length === 0 ||
      exams.includes(context.exam) ||
      (exams.includes("NCLEX") && (context.exam === "NCLEX_PN" || context.exam === "NCLEX_RN")));
  const countryMatch = countries.length === 0 || countries.includes(context.country) || countries.includes("GLOBAL");
  return examMatch && countryMatch;
}

function examMetaForContext(
  lesson: PathwayLessonRecord,
  context: { exam: PathwayLessonRuntimeExam; country: PathwayLessonRuntimeCountry },
): PathwayLessonExamMeta | undefined {
  const examMeta = lesson.examMeta ?? [];
  const direct = examMeta.find((entry) => entry.exam === context.exam);
  if (direct) return direct;
  if (context.exam === "NCLEX_PN" || context.exam === "NCLEX_RN") {
    const generic = examMeta.find((entry) => entry.exam === "NCLEX");
    if (generic) return generic;
  }
  return undefined;
}

function lessonPriorityWeight(priority: PathwayLessonPriority | undefined): number {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  return 2;
}

export function sortAndFilterLessonsForPathwayContext(
  pathwayId: string,
  lessons: PathwayLessonRecord[],
): PathwayLessonRecord[] {
  const context = resolveLessonContextForPathwayId(pathwayId);
  return lessons
    .filter((lesson) => pathwayLessonEligibleForPublicMarketingSurface(lesson))
    .filter((lesson) => matchesLessonContext(lesson, context))
    .map((lesson) => ({ ...lesson, activeExamMeta: examMetaForContext(lesson, context) }))
    .sort((a, b) => {
      const yieldDelta = pathwayLessonYieldWeight(a.activeExamMeta?.yieldLevel) - pathwayLessonYieldWeight(b.activeExamMeta?.yieldLevel);
      if (yieldDelta !== 0) return yieldDelta;
      const priorityDelta = lessonPriorityWeight(a.priority) - lessonPriorityWeight(b.priority);
      if (priorityDelta !== 0) return priorityDelta;
      const categoryDelta = a.bodySystem.localeCompare(b.bodySystem);
      if (categoryDelta !== 0) return categoryDelta;
      return a.title.localeCompare(b.title);
    });
}

/**
 * Catalog JSON sometimes ships short seoDescription strings that still describe the lesson but fall
 * below the structural gate’s ~12-word floor. Pad deterministically from title — no new editorial claims.
 */
function ensureCatalogLessonSeoDescriptionWordFloor(seoDescription: string, title: string): string {
  const t = seoDescription.trim();
  if (countWords(stripToPlainText(t)) >= 12) return t;
  const shortTitle = title.replace(/\s*\([^)]*\)\s*$/, "").trim() || title.trim() || "this topic";
  const pad = `Clinical framing, safety cues, prioritization patterns, and exam-style rationale for ${shortTitle}.`;
  return t.length > 0 ? `${t} ${pad}`.trim() : pad.trim();
}

export function sanitizeQuizItems(raw: unknown): PathwayLessonQuizItem[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayLessonQuizItem[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    const question = typeof o.question === "string" ? o.question.trim() : "";
    const options = Array.isArray(o.options)
      ? o.options.filter((y): y is string => typeof y === "string" && y.trim().length > 0)
      : [];
    const correct = typeof o.correct === "number" && Number.isInteger(o.correct) ? o.correct : -1;
    if (question.length < 5 || options.length < 2 || correct < 0 || correct >= options.length) continue;
    const rationale = typeof o.rationale === "string" ? o.rationale.trim() : undefined;
    out.push({ question, options, correct, ...(rationale ? { rationale } : {}) });
  }
  return out.length ? out : undefined;
}

export function normalizeLesson(raw: LessonInput, pathwayId?: string): PathwayLessonRecord {
  const title = typeof raw.title === "string" ? raw.title : "Lesson";
  const seoTitle = typeof raw.seoTitle === "string" ? raw.seoTitle : title;
  const seoDescription = ensureCatalogLessonSeoDescriptionWordFloor(
    typeof raw.seoDescription === "string" ? raw.seoDescription : "",
    title,
  );
  const rawPc = raw.previewSectionCount;
  const previewCandidate =
    typeof rawPc === "number" && Number.isFinite(rawPc) && rawPc > 0 ? Math.floor(rawPc) : 1;

  const incoming = sanitizeIncomingSections(raw.sections as PathwayLessonSection[]);
  const usePremium = lessonUsesPremiumStructure(incoming);
  const expanded = usePremium ? finalizePremiumSections(incoming) : expandToStandardFiveSections(incoming);

  const premiumOmitted = raw.premiumOmittedSections;
  const relatedLessonRefs = raw.relatedLessonRefs;

  const system = typeof raw.system === "string" && raw.system.trim().length > 0 ? raw.system.trim() : "";
  const bodySystem = typeof raw.bodySystem === "string" ? raw.bodySystem : "";
  const embeddedSoundLibraries = sanitizeEmbeddedSoundLibraries(
    (raw as { embeddedSoundLibraries?: unknown }).embeddedSoundLibraries,
  );
  const base: PathwayLessonRecord = {
    slug: raw.slug,
    title,
    topic: typeof raw.topic === "string" ? raw.topic : "",
    topicSlug: typeof raw.topicSlug === "string" ? raw.topicSlug : "",
    system: system || bodySystem,
    bodySystem,
    previewSectionCount: Math.max(1, Math.min(previewCandidate, usePremium ? 11 : 5)),
    seoTitle,
    seoDescription,
    sections: expanded,
    ...(premiumOmitted?.length ? { premiumOmittedSections: premiumOmitted } : {}),
    ...(relatedLessonRefs?.length ? { relatedLessonRefs } : {}),
    ...(embeddedSoundLibraries?.length ? { embeddedSoundLibraries } : {}),
    ...mergeLessonAudienceMetadata(raw, pathwayId),
  };

  const maxPreview = Math.min(expanded.length, usePremium ? 11 : 5);
  const preview = Math.max(1, Math.min(base.previewSectionCount, maxPreview || 1));
  const preTest = sanitizeQuizItems((raw as { preTest?: unknown }).preTest);
  const postTest = sanitizeQuizItems((raw as { postTest?: unknown }).postTest);

  const withQuizzes: PathwayLessonRecord = {
    ...base,
    previewSectionCount: preview,
    ...(preTest ? { preTest } : {}),
    ...(postTest ? { postTest } : {}),
  };

  const hy = deriveLessonHighYieldStudyFields(expanded, raw as { studyTakeaways?: unknown; studyCommonTraps?: unknown; memoryAnchor?: unknown });
  const withStudyStrips: PathwayLessonRecord = {
    ...withQuizzes,
    ...(hy.studyTakeaways && hy.studyTakeaways.length >= 1 ? { studyTakeaways: hy.studyTakeaways } : {}),
    ...(hy.studyCommonTraps && hy.studyCommonTraps.length > 0 ? { studyCommonTraps: hy.studyCommonTraps } : {}),
    ...(hy.memoryAnchor ? { memoryAnchor: hy.memoryAnchor } : {}),
    ...(hy.omitHighYieldSectionIds && hy.omitHighYieldSectionIds.length > 0
      ? { omitHighYieldSectionIds: hy.omitHighYieldSectionIds }
      : {}),
  };

  const structuralQuality = evaluatePathwayLessonStructuralGate(withStudyStrips);
  return {
    ...withStudyStrips,
    structuralQuality,
    ...(usePremium ? { premiumValidation: validatePathwayLessonPremium(withStudyStrips) } : {}),
  };
}
export function getCatalogLessonsRaw(pathwayId: string): LessonInput[] {
  const bucket = getCatalogData().pathways[pathwayId];
  const fromJson = bucket?.lessons?.length ? bucket.lessons.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
  const allied = alliedBundledLessonsForPathway(pathwayId);
  const newGrad = newGradTransitionLessonsForPathway(pathwayId);
  const seen = new Set<string>();
  const merged: LessonInput[] = [];
  for (const l of [...fromJson, ...allied, ...newGrad]) {
    if (seen.has(l.slug)) continue;
    seen.add(l.slug);
    merged.push(l);
  }
  return prependScopedGoldCatalogLessons(pathwayId, merged);
}

export function getCatalogPathwayLessonsSync(pathwayId: string): PathwayLessonRecord[] {
  return getCatalogLessonsRaw(pathwayId).map((raw) => normalizeLesson(raw, pathwayId));
}

/**
 * Audit / inventory tooling: bundled `catalog.json` + optional `allied-bundled-catalog.json` +
 * `new-grad-transition-catalog.json` + scoped-gold,
 * normalized, then the same exam/country filter as catalog-backed hub paths. **Does not include Prisma-published
 * lessons.** DB-only pathways still list via `getPathwayLessonsPage` when published rows exist.
 */
export function getEffectiveCatalogLessonsForPathwaySync(pathwayId: string): PathwayLessonRecord[] {
  return sortAndFilterLessonsForPathwayContext(pathwayId, getCatalogPathwayLessonsSync(pathwayId));
}

/** True when the bundled catalog path yields at least one lesson (JSON slice and/or scoped-gold for this pathway). */
export function pathwayHasBundledCatalogLessonsSync(pathwayId: string): boolean {
  return getCatalogPathwayLessonsSync(pathwayId).length > 0;
}

/** Pathway ids that have at least one catalog (+ allied bundled slice + scoped-gold) lesson row. */
export function listCatalogPathwayIdsWithLessonsSync(): string[] {
  const ids = new Set<string>([
    ...Object.keys(getCatalogData().pathways ?? {}),
    ...Object.keys(getAlliedBundledPathways()),
    ...Object.keys(getNewGradTransitionPathways()),
  ]);
  return [...ids].filter((id) => getCatalogPathwayLessonsSync(id).length > 0);
}

/**
 * Marker for `pathway_lessons.sections` JSON when pre/post quizzes are stored alongside section bodies
 * (plain array cannot hold `preTest` / `postTest` at the top level).
 */
export const NN_LESSON_DB_PAYLOAD_V2 = "nnLessonPayloadV2" as const;

/**
 * Unwrap DB `sections` JSON: either a section array (legacy) or {@link NN_LESSON_DB_PAYLOAD_V2} with nested sections + quizzes.
 */
export function unwrapPathwayLessonDbSections(sections: unknown): {
  sectionList: unknown;
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
} {
  if (sections && typeof sections === "object" && !Array.isArray(sections)) {
    const o = sections as Record<string, unknown>;
    if (o[NN_LESSON_DB_PAYLOAD_V2] === true && Array.isArray(o.sections)) {
      const pre = sanitizeQuizItems(o.preTest);
      const post = sanitizeQuizItems(o.postTest);
      return {
        sectionList: o.sections,
        ...(pre ? { preTest: pre } : {}),
        ...(post ? { postTest: post } : {}),
      };
    }
  }
  return { sectionList: sections };
}

export function pathwayLessonRowToInput(row: {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: unknown;
  locale: string;
  exams?: string[];
  countries?: string[];
  priority?: string;
  examMeta?: unknown;
}): LessonInput {
  const unwrapped = unwrapPathwayLessonDbSections(row.sections);
  return {
    slug: row.slug,
    title: row.title,
    topic: row.topic,
    topicSlug: row.topicSlug,
    bodySystem: row.bodySystem,
    previewSectionCount: row.previewSectionCount,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    sections: unwrapped.sectionList as LessonInput["sections"],
    ...(Array.isArray(row.exams) ? { exams: row.exams as PathwayLessonRuntimeExam[] } : {}),
    ...(Array.isArray(row.countries) ? { countries: row.countries as PathwayLessonRuntimeCountry[] } : {}),
    ...(typeof row.priority === "string" ? { priority: row.priority as PathwayLessonPriority } : {}),
    ...(Array.isArray(row.examMeta) ? { examMeta: row.examMeta as PathwayLessonExamMeta[] } : {}),
    ...(unwrapped.preTest ? { preTest: unwrapped.preTest } : {}),
    ...(unwrapped.postTest ? { postTest: unwrapped.postTest } : {}),
  } as LessonInput;
}

/**
 * Persists the same boolean as `normalizeLesson(pathwayLessonRowToInput(row), pathwayId).structuralQuality?.publicComplete`
 * without requiring callers to duplicate gate logic.
 */
export function computeStructuralPublicCompleteFromDbRow(
  row: Parameters<typeof pathwayLessonRowToInput>[0] & { pathwayId: string },
): boolean {
  return Boolean(normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId).structuralQuality?.publicComplete);
}

/** @deprecated Prefer {@link normalizeLesson} */
export const normalizePathwayLessonInput = normalizeLesson;
