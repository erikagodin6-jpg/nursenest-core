/**
 * Pathway lesson data layer (marketing + sitemap).
 *
 * **Scale:** Hub/topic lists use offset pagination and hub-list selects (no `sections` JSON).
 * **Build:** Marketing lesson routes use `generateStaticParams() => []` + `dynamicParams` so builds
 * do not pre-render every lesson slug.
 * **Catalog:** `catalog.json` is bundled with server code; full-lesson bodies load only for detail/sitemap
 * batches — avoid passing entire pathway catalogs to client components.
 */
import catalog from "@/content/pathway-lessons/catalog.json";
import {
  prependScopedGoldCatalogLessons,
  scopedGoldHubRowsForPathway,
} from "@/lib/lessons/scoped-lessons/scoped-gold-registry";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import type { PathwayLessonEducationalOverlay } from "@/lib/i18n/educational-content-overlay";
import { applyPathwayLessonEducationalOverlay } from "@/lib/i18n/educational-content-overlay";
import { fetchPublishedPathwayLessonOverlayMapSafe } from "@/lib/i18n/educational-translation-db";
import { inferExamAudienceFromPathwayId } from "@/lib/lessons/exam-complete-lesson-template";
import {
  normalizePathwayLessonLocale,
  PATHWAY_LESSON_CANONICAL_DB_LOCALE,
  PATHWAY_LESSON_SITEMAP_LOCALE,
} from "@/lib/lessons/pathway-lesson-locale";
import {
  evaluatePathwayLessonStructuralGate,
  lessonUsesPremiumStructure,
  orderPremiumSections,
  PREMIUM_SECTION_KINDS,
  validatePathwayLessonPremium,
} from "@/lib/lessons/pathway-lesson-premium";
import {
  type PathwayLessonClinicalPriority,
  type PathwayLessonExamMeta,
  type PathwayLessonPriority,
  pathwayLessonHasRenderableHubSlug,
  type PathwayLessonAudienceTier,
  type PathwayLessonCountryScope,
  type PathwayLessonExamRelevance,
  type PathwayLessonRuntimeCountry,
  type PathwayLessonRuntimeExam,
  type PathwayLessonFigure,
  type PathwayLessonFigureKind,
  type PathwayLessonLocaleMeta,
  type PathwayLessonOmittedPremiumSection,
  type PathwayLessonQuizItem,
  type PathwayLessonRecord,
  type PathwayLessonRelatedRef,
  type PathwayLessonSection,
  type PathwayLessonSectionKind,
  type PathwayLessonYieldLevel,
} from "@/lib/lessons/pathway-lesson-types";
import { resolveLessonContextForPathwayId } from "@/lib/lessons/lesson-region-exam";
import { ContentStatus, type Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { sortPathwayLessonsForPublicPreview } from "@/lib/lessons/pathway-lesson-public-preview-priority";
import type { LaunchBundleEntry, PathwayLaunchBundleSpec } from "@/lib/lessons/pathway-launch-bundle";
import { getLaunchBundleSpec } from "@/lib/lessons/pathway-launch-bundle";
import { maxSafeOffsetPage } from "@/lib/api/api-pagination-limits";
import {
  PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  PATHWAY_HUB_PAGE_SIZE_MAX,
} from "@/lib/lessons/pathway-lesson-scale";
import { pathwayLessonYieldWeight } from "@/lib/lessons/pathway-lesson-yield";
import { dedupePathwayLessonsForLibrary } from "@/lib/lessons/pathway-lesson-dedupe";

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
        audienceTiers?: PathwayLessonAudienceTier[];
        countryScope?: PathwayLessonCountryScope;
        examRelevance?: PathwayLessonExamRelevance;
        exams?: PathwayLessonRuntimeExam[];
        countries?: PathwayLessonRuntimeCountry[];
        priority?: PathwayLessonPriority;
        examMeta?: PathwayLessonExamMeta[];
      }>;
    }
  >;
};

const data = catalog as CatalogShape;

type LessonInput = CatalogShape["pathways"][string]["lessons"][number];

export { PATHWAY_HUB_PAGE_SIZE_DEFAULT, PATHWAY_HUB_PAGE_SIZE_MAX } from "@/lib/lessons/pathway-lesson-scale";
/** DB read timeout for pathway lesson queries (marketing paths). */
export const PATHWAY_LESSON_DB_TIMEOUT_MS = 12_000;
/**
 * Cross-request Data Cache TTL for public lesson payloads (no user/session).
 * Personalized progress stays outside this layer (see pathway-lesson-progress).
 * Also use as `export const revalidate` on marketing lesson detail so page ISR matches Data Cache.
 */
export const PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS = 3600;
/** Related lessons block on lesson detail — small bounded list. */
export const RELATED_PATHWAY_LESSONS_LIMIT = 8;
/** Topic-filtered question hub / cross-links: same numeric cap as {@link RELATED_PATHWAY_LESSONS_LIMIT}. */
export const RELATED_LESSONS_FOR_TOPIC_CAP = RELATED_PATHWAY_LESSONS_LIMIT;
/** Pass to {@link getRelatedPathwayLessons} when no lesson should be excluded (hub / topic-only views). */
export const RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL = "__related_lessons_exclude_none__";
/** Sitemap / batch reads: rows per round-trip. */
export const PATHWAY_LESSON_SITEMAP_BATCH = 600;
/** Absolute safety cap: catalog pathways with more lessons are truncated for list/hub pagination math. */
export const PATHWAY_CATALOG_LIST_HARD_CAP = 2_000;
/** Hub lesson search: ignore single-character noise; cap length for safety. */
export const PATHWAY_HUB_SEARCH_MIN_LEN = 2;
export const PATHWAY_HUB_SEARCH_MAX_LEN = 80;

/** Normalized search string for pathway lesson hubs (catalog + DB lists), or `undefined` when inactive. */
export function normalizePathwayHubSearchQuery(raw: string | undefined): string | undefined {
  if (typeof raw !== "string") return undefined;
  const t = raw.trim();
  if (t.length < PATHWAY_HUB_SEARCH_MIN_LEN) return undefined;
  return t.slice(0, PATHWAY_HUB_SEARCH_MAX_LEN);
}

function hubSearchHaystackLessonInput(l: LessonInput): string {
  return `${l.title}\n${l.slug}\n${l.topic}\n${l.topicSlug}`.toLowerCase();
}

function lessonInputMatchesHubSearch(l: LessonInput, qLower: string): boolean {
  return hubSearchHaystackLessonInput(l).includes(qLower);
}

function pathwayLessonHubSearchWhere(q: string): Prisma.PathwayLessonWhereInput {
  return {
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { topic: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { topicSlug: { contains: q, mode: "insensitive" } },
    ],
  };
}

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
  if (raw === "REX_PN" || raw === "NCLEX_PN" || raw === "NCLEX_RN" || raw === "NCLEX") return raw;
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

  const intro = byKind.intro ?? byKind.clinical_meaning;
  const core = byKind.core ?? byKind.core_concept;
  const clinical = byKind.clinical_application ?? byKind.clinical_scenario;
  const exam = byKind.exam_tips ?? byKind.exam_relevance;
  const explicitTakeaways = byKind.takeaways;

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

/** Drops lesson rows that cannot build a safe public hub href; logs for admin follow-up. */
function filterHubListItemsForSafeSlugs(items: PathwayLessonRecord[], pathwayId: string): PathwayLessonRecord[] {
  const out: PathwayLessonRecord[] = [];
  for (const it of items) {
    if (pathwayLessonHasRenderableHubSlug(it)) {
      out.push(it);
      continue;
    }
    safeServerLog("content_quarantine", "pathway_lesson_hub_slug_unsafe", {
      pathwayId,
      slug_preview: String(it.slug ?? "").slice(0, 120),
    });
  }
  return out;
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

function sortAndFilterLessonsForPathwayContext(
  pathwayId: string,
  lessons: PathwayLessonRecord[],
): PathwayLessonRecord[] {
  const context = resolveLessonContextForPathwayId(pathwayId);
  return lessons
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
 * Hub / list / related-link rows: metadata only — no `sections` JSON loaded from DB.
 * Enrichment (FNP, NCLEX hubs) falls back to {@link PathwayLessonRecord.seoDescription} when bodies are absent.
 */
function normalizeLessonForHubList(raw: LessonInput, pathwayId?: string): PathwayLessonRecord {
  const title = typeof raw.title === "string" ? raw.title : "Lesson";
  const seoTitle = typeof raw.seoTitle === "string" ? raw.seoTitle : title;
  const seoDescription = typeof raw.seoDescription === "string" ? raw.seoDescription : "";
  const rawPc = raw.previewSectionCount;
  const previewCandidate =
    typeof rawPc === "number" && Number.isFinite(rawPc) && rawPc > 0 ? Math.floor(rawPc) : 1;
  const previewSectionCount = Math.max(1, Math.min(previewCandidate, 5));
  const system = typeof raw.system === "string" && raw.system.trim().length > 0 ? raw.system.trim() : "";
  const bodySystem = typeof raw.bodySystem === "string" ? raw.bodySystem : "";
  return {
    slug: raw.slug,
    title,
    topic: typeof raw.topic === "string" ? raw.topic : "",
    topicSlug: typeof raw.topicSlug === "string" ? raw.topicSlug : "",
    system: system || bodySystem,
    bodySystem,
    previewSectionCount,
    seoTitle,
    seoDescription,
    sections: [],
    ...mergeLessonAudienceMetadata(raw, pathwayId),
  };
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
  const seoDescription = typeof raw.seoDescription === "string" ? raw.seoDescription : "";
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

  const structuralQuality = evaluatePathwayLessonStructuralGate(withQuizzes);
  return {
    ...withQuizzes,
    structuralQuality,
    ...(usePremium ? { premiumValidation: validatePathwayLessonPremium(withQuizzes) } : {}),
  };
}

/** @deprecated Prefer importing {@link normalizeLesson} directly; alias kept for older call sites. */
export const normalizePathwayLessonInput = normalizeLesson;

/**
 * Hub cards: keep metadata + structural gate, drop heavy bodies after completeness filtering.
 */
export function stripPathwayLessonToHubListShape(full: PathwayLessonRecord): PathwayLessonRecord {
  return {
    slug: full.slug,
    title: full.title,
    topic: full.topic,
    topicSlug: full.topicSlug,
    system: full.system ?? full.bodySystem,
    bodySystem: full.bodySystem,
    previewSectionCount: full.previewSectionCount,
    seoTitle: full.seoTitle,
    seoDescription: full.seoDescription,
    sections: [],
    structuralQuality: full.structuralQuality,
    localeMeta: full.localeMeta,
    ...(full.audienceTiers?.length ? { audienceTiers: full.audienceTiers } : {}),
    ...(full.countryScope ? { countryScope: full.countryScope } : {}),
    ...(full.examRelevance ? { examRelevance: full.examRelevance } : {}),
    ...(full.relatedLessonRefs?.length ? { relatedLessonRefs: full.relatedLessonRefs } : {}),
    ...(full.premiumOmittedSections?.length ? { premiumOmittedSections: full.premiumOmittedSections } : {}),
    ...(full.audioUrl ? { audioUrl: full.audioUrl } : {}),
    ...(full.exams?.length ? { exams: full.exams } : {}),
    ...(full.countries?.length ? { countries: full.countries } : {}),
    ...(full.priority ? { priority: full.priority } : {}),
    ...(full.examMeta?.length ? { examMeta: full.examMeta } : {}),
    ...(full.activeExamMeta ? { activeExamMeta: full.activeExamMeta } : {}),
    ...(full.preTest ? { preTest: full.preTest } : {}),
    ...(full.postTest ? { postTest: full.postTest } : {}),
    ...(full.premiumValidation ? { premiumValidation: full.premiumValidation } : {}),
  };
}

function listCatalogPathwayIdsWithLessonsSync(): string[] {
  return Object.keys(data.pathways).filter((id) => getCatalogPathwayLessonsSync(id).length > 0);
}

function filterCatalogLessonsByTopicSlugs(raw: LessonInput[], topicSlugsIn?: string[]): LessonInput[] {
  if (!topicSlugsIn) return raw;
  if (topicSlugsIn.length === 0) return [];
  const set = new Set(topicSlugsIn);
  return raw.filter((l) => set.has(l.topicSlug));
}

/**
 * Static catalog slice for one pathway, merged with scoped-gold injectables (shared core + per-pathway
 * variant in code — see `scoped-gold-registry.ts`). Catalog rows take precedence when slugs match.
 * Prefer registry/providers for cross-pathway lessons so the hub list scales without duplicate JSON rows.
 */
function getCatalogLessonsRaw(pathwayId: string): LessonInput[] {
  const bucket = data.pathways[pathwayId];
  const fromJson = bucket?.lessons?.length ? bucket.lessons.slice(0, PATHWAY_CATALOG_LIST_HARD_CAP) : [];
  return prependScopedGoldCatalogLessons(pathwayId, fromJson);
}

function getCatalogPathwayLessonsSync(pathwayId: string): PathwayLessonRecord[] {
  return getCatalogLessonsRaw(pathwayId).map((raw) => normalizeLesson(raw, pathwayId));
}

/** First N lesson titles from the static catalog (public marketing previews). Empty when catalog has no rows for the pathway. */
export function getCatalogLessonPreviewTitles(pathwayId: string, limit = 4): string[] {
  const lessons = sortPathwayLessonsForPublicPreview(pathwayId, getCatalogPathwayLessonsSync(pathwayId));
  return lessons.slice(0, Math.max(0, limit)).map((l) => l.title);
}

export type PathwayLessonRuntimeSource = "database" | "catalog" | "none";

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
  return {
    slug: row.slug,
    title: row.title,
    topic: row.topic,
    topicSlug: row.topicSlug,
    bodySystem: row.bodySystem,
    previewSectionCount: row.previewSectionCount,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    sections: row.sections as LessonInput["sections"],
    ...(Array.isArray(row.exams) ? { exams: row.exams as PathwayLessonRuntimeExam[] } : {}),
    ...(Array.isArray(row.countries) ? { countries: row.countries as PathwayLessonRuntimeCountry[] } : {}),
    ...(typeof row.priority === "string" ? { priority: row.priority as PathwayLessonPriority } : {}),
    ...(Array.isArray(row.examMeta) ? { examMeta: row.examMeta as PathwayLessonExamMeta[] } : {}),
  };
}

function withLocaleMeta(lesson: PathwayLessonRecord, meta: PathwayLessonLocaleMeta): PathwayLessonRecord {
  return { ...lesson, localeMeta: meta };
}

/** File-based `lessons.json` + optional DB-published overlays (slug or `pathwayId:slug`). */
function applyLessonEducationalOverlay(
  lesson: PathwayLessonRecord,
  marketingLocale: string | undefined,
  pathwayId: string,
  dbLessonOverlayBundle?: Record<string, PathwayLessonEducationalOverlay>,
): PathwayLessonRecord {
  return applyPathwayLessonEducationalOverlay(
    lesson,
    normalizePathwayLessonLocale(marketingLocale),
    pathwayId,
    dbLessonOverlayBundle,
  );
}

/** Recompute structural gate after overlay patches titles/sections (locale overlays). */
function applyOverlayAndStructural(
  lesson: PathwayLessonRecord,
  marketingLocale: string | undefined,
  pathwayId: string,
  dbLessonOverlayBundle?: Record<string, PathwayLessonEducationalOverlay>,
): PathwayLessonRecord {
  const after = applyLessonEducationalOverlay(lesson, marketingLocale, pathwayId, dbLessonOverlayBundle);
  return { ...after, structuralQuality: evaluatePathwayLessonStructuralGate(after) };
}

function lessonLocaleMeta(
  requestedRaw: string | undefined,
  contentLocale: string,
  usedLocaleFallback: boolean,
  isCatalogEnglishSource: boolean,
): PathwayLessonLocaleMeta {
  return {
    requestedContentLocale: normalizePathwayLessonLocale(requestedRaw),
    contentLocale,
    usedLocaleFallback,
    isCatalogEnglishSource,
  };
}

async function dbCall<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, PATHWAY_LESSON_DB_TIMEOUT_MS, {
    scope: "pathway_lessons",
    label: "pathway_lesson_prisma",
  });
}

async function scopedGoldSlugPublishedInDb(pathwayId: string, locale: string, slug: string): Promise<boolean> {
  const n = await dbCall(
    () =>
      prisma.pathwayLesson.count({
        where: { pathwayId, locale, slug, status: ContentStatus.PUBLISHED },
      }),
    0,
  );
  return n > 0;
}

/** Hub rows for scoped gold lessons not yet published in DB (DB overrides catalog/injections). */
async function listMissingScopedGoldHubRows(
  pathwayId: string,
  locale: string,
  topicSlugsIn?: string[],
): Promise<LessonInput[]> {
  const candidates = scopedGoldHubRowsForPathway(pathwayId, topicSlugsIn);
  const catalogFullBySlug = new Map(getCatalogLessonsRaw(pathwayId).map((l) => [l.slug, l]));
  const out: LessonInput[] = [];
  for (const row of candidates) {
    if (await scopedGoldSlugPublishedInDb(pathwayId, locale, row.slug)) continue;
    const full = catalogFullBySlug.get(row.slug);
    if (full) {
      out.push(full);
      continue;
    }
    safeServerLog("content_quarantine", "scoped_gold_hub_missing_catalog_body", {
      pathwayId,
      slug: row.slug,
    });
  }
  return out;
}

/** Any published row for pathway (any locale). */
async function pathwayHasPublishedDbLessons(pathwayId: string): Promise<boolean> {
  const row = await dbCall(
    () =>
      prisma.pathwayLesson.findFirst({
        where: { pathwayId, status: ContentStatus.PUBLISHED },
        select: { id: true },
      }),
    null,
  );
  return !!row;
}


/** Total published rows for pathway across locales (audit / metrics). */
async function countPublishedDbLessonsAllLocales(pathwayId: string): Promise<number> {
  return dbCall(
    () => prisma.pathwayLesson.count({ where: { pathwayId, status: ContentStatus.PUBLISHED } }),
    0,
  );
}

/**
 * Same count as {@link countPublishedDbLessonsAllLocales} but with timeout detection.
 * When unavailable, caller can fail closed instead of silently surfacing catalog subset.
 */
async function countPublishedDbLessonsAllLocalesWithHealth(
  pathwayId: string,
): Promise<{ count: number; unavailable: boolean }> {
  const sentinel = -1;
  const n = await dbCall(
    () => prisma.pathwayLesson.count({ where: { pathwayId, status: ContentStatus.PUBLISHED } }),
    sentinel,
  );
  if (n === sentinel) return { count: 0, unavailable: true };
  return { count: n, unavailable: false };
}

/**
 * Pick which `locale` key to query for list/topic pages — one `groupBy` per request.
 * Prefers requested locale when present, else English, else first available.
 */
async function resolveEffectiveListLocale(pathwayId: string, requestedRaw: string): Promise<string> {
  const requested = normalizePathwayLessonLocale(requestedRaw);
  const rows = await dbCall(
    () =>
      prisma.pathwayLesson.groupBy({
        by: ["locale"],
        where: { pathwayId, status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      }),
    [],
  );
  if (rows.length === 0) return requested;
  const available = new Set(rows.map((r) => r.locale));
  if (available.has(requested)) return requested;
  if (requested !== "en" && available.has("en")) return "en";
  const sorted = [...available].sort((a, b) => a.localeCompare(b));
  return sorted[0] ?? "en";
}

/**
 * Prefer {@link PATHWAY_LESSON_CANONICAL_DB_LOCALE} rows when the pathway has any published English lessons;
 * otherwise fall back to {@link resolveEffectiveListLocale} (legacy pathways with non-English-only rows).
 */
async function effectiveLocaleForPathwayLessonDbRows(pathwayId: string, requestedRaw: string): Promise<string> {
  const requested = normalizePathwayLessonLocale(requestedRaw);
  const enCount = await dbCall(
    () =>
      prisma.pathwayLesson.count({
        where: { pathwayId, status: ContentStatus.PUBLISHED, locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE },
      }),
    0,
  );
  if (enCount > 0) return PATHWAY_LESSON_CANONICAL_DB_LOCALE;
  return resolveEffectiveListLocale(pathwayId, requested);
}

const PATHWAY_LESSON_HUB_LIST_SELECT = {
  slug: true,
  title: true,
  topic: true,
  topicSlug: true,
  bodySystem: true,
  previewSectionCount: true,
  seoTitle: true,
  seoDescription: true,
  exams: true,
  countries: true,
  priority: true,
  examMeta: true,
  locale: true,
} as const;

const PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS = {
  ...PATHWAY_LESSON_HUB_LIST_SELECT,
  sections: true,
} as const;

async function loadPublishedLessonRowsPage(
  pathwayId: string,
  locale: string,
  skip: number,
  take: number,
  topicSlugsIn?: string[],
  hubSearch?: string,
  /** When true, load `sections` JSON so subscriber completeness gates can run before stripping for hub cards. */
  includeSections = false,
): Promise<LessonInput[]> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return [];
  const base: Prisma.PathwayLessonWhereInput = {
    pathwayId,
    status: ContentStatus.PUBLISHED,
    locale,
    ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
  };
  const where: Prisma.PathwayLessonWhereInput =
    hubSearch && hubSearch.length >= PATHWAY_HUB_SEARCH_MIN_LEN
      ? { AND: [base, pathwayLessonHubSearchWhere(hubSearch)] }
      : base;
  const select = includeSections ? PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS : PATHWAY_LESSON_HUB_LIST_SELECT;
  return dbCall(async () => {
    const rows = await prisma.pathwayLesson.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      skip,
      take,
      select,
    });
    return rows.map((row) =>
      pathwayLessonRowToInput({
        ...row,
        sections: includeSections && "sections" in row && row.sections != null ? row.sections : [],
      }),
    );
  }, []);
}

async function countPublishedLessonRows(
  pathwayId: string,
  locale: string,
  topicSlugsIn?: string[],
  hubSearch?: string,
): Promise<number> {
  if (topicSlugsIn && topicSlugsIn.length === 0) return 0;
  const base: Prisma.PathwayLessonWhereInput = {
    pathwayId,
    status: ContentStatus.PUBLISHED,
    locale,
    ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
  };
  const where: Prisma.PathwayLessonWhereInput =
    hubSearch && hubSearch.length >= PATHWAY_HUB_SEARCH_MIN_LEN
      ? { AND: [base, pathwayLessonHubSearchWhere(hubSearch)] }
      : base;
  return dbCall(() => prisma.pathwayLesson.count({ where }), 0);
}

export type PathwayLessonListLocaleInfo = {
  requested: string;
  effective: string;
  usedEnglishFallback: boolean;
  catalogEnglishOnlySource: boolean;
};

export type PathwayLessonsPageResult = {
  items: PathwayLessonRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  locale?: PathwayLessonListLocaleInfo;
};

function clampPageSize(pageSize: number): number {
  return Math.min(PATHWAY_HUB_PAGE_SIZE_MAX, Math.max(1, Math.floor(pageSize)));
}

function clampPage(page: number): number {
  return Math.max(1, Math.floor(page));
}

async function getPathwayLessonsPageImpl(
  pathwayId: string,
  page: number = 1,
  pageSize: number = PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<PathwayLessonsPageResult> {
  const ps = clampPageSize(pageSize);
  const p = Math.min(clampPage(page), maxSafeOffsetPage(ps));
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedPathwayLessonOverlayMapSafe(requested);
  const topicSlugsIn = listOptions?.topicSlugsIn;
  const qRaw = normalizePathwayHubSearchQuery(listOptions?.q);
  const qLower = qRaw ? qRaw.toLowerCase() : "";

  const dbPresence = await countPublishedDbLessonsAllLocalesWithHealth(pathwayId);
  if (dbPresence.unavailable) {
    safeServerLog("pathway_lessons", "hub_list_db_unavailable_fail_closed", {
      pathwayId,
      page: p,
      pageSize: ps,
      hubSearch: qRaw ? "1" : "0",
    });
    return {
      ...emptyPathwayLessonsPageResult(p, ps),
      locale: {
        requested,
        effective: requested,
        usedEnglishFallback: false,
        catalogEnglishOnlySource: false,
      },
    };
  }
  const dbAny = dbPresence.count > 0;
  if (dbAny) {
    const t0 = performance.now();
    const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
    const missingGolds = await listMissingScopedGoldHubRows(pathwayId, effective, topicSlugsIn);
    const goldsFiltered = qRaw ? missingGolds.filter((row) => lessonInputMatchesHubSearch(row, qLower)) : missingGolds;
    const dbTotal = await countPublishedLessonRows(pathwayId, effective, topicSlugsIn, qRaw);
    const total = goldsFiltered.length + dbTotal;
    const pageCount = Math.max(1, Math.ceil(total / ps));
    const safePage = Math.min(p, pageCount);
    const skip = (safePage - 1) * ps;

    const takeGold = Math.max(0, Math.min(ps, goldsFiltered.length - skip));
    const goldStart = Math.min(skip, goldsFiltered.length);
    const goldPageRows = takeGold > 0 ? goldsFiltered.slice(goldStart, goldStart + takeGold) : [];

    const dbSkip = skip >= goldsFiltered.length ? skip - goldsFiltered.length : 0;
    const dbTake = Math.max(0, ps - goldPageRows.length);
    const dbRows =
      dbTake > 0
        ? await loadPublishedLessonRowsPage(pathwayId, effective, dbSkip, dbTake, topicSlugsIn, qRaw, true)
        : [];
    const raw = [...goldPageRows, ...dbRows];
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    const contextItems = sortAndFilterLessonsForPathwayContext(
      pathwayId,
      filterHubListItemsForSafeSlugs(
        raw.map((row) =>
          stripPathwayLessonToHubListShape(
            applyOverlayAndStructural(
              withLocaleMeta(normalizeLesson(row, pathwayId), meta),
              marketingLocale,
              pathwayId,
              lessonDbOverlays,
            ),
          ),
        ),
        pathwayId,
      ),
    );
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("pathway_lessons", "hub_list_db_timing", {
      pathwayId,
      pathwayLessonRuntimeSource: "database",
      durationMs,
      page: safePage,
      pageSize: ps,
      total,
      hubSearch: qRaw ? "1" : "0",
    });
    const deduped = dedupePathwayLessonsForLibrary(contextItems, {
      pathwayIdHint: pathwayId,
      source: `hub_page:${pathwayId}:db`,
      devLog: true,
    });
    return {
      items: deduped.items,
      total,
      page: safePage,
      pageSize: ps,
      pageCount,
      locale: {
        requested,
        effective,
        usedEnglishFallback: requested !== effective,
        catalogEnglishOnlySource: false,
      },
    };
  }

  const allRaw = filterCatalogLessonsByTopicSlugs(getCatalogLessonsRaw(pathwayId), topicSlugsIn);
  const filteredRaw = qRaw ? allRaw.filter((row) => lessonInputMatchesHubSearch(row, qLower)) : allRaw;
  const total = filteredRaw.length;
  const pageCount = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(p, pageCount);
  const skip = (safePage - 1) * ps;
  const pageRows = filteredRaw.slice(skip, skip + ps);
  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  safeServerLog("pathway_lessons", "hub_list_source", {
    pathwayId,
    pathwayLessonRuntimeSource: total > 0 ? "catalog" : "none",
    total,
    page: safePage,
    pageSize: ps,
    hubSearch: qRaw ? "1" : "0",
  });
  const contextItems = sortAndFilterLessonsForPathwayContext(
    pathwayId,
    filterHubListItemsForSafeSlugs(
      pageRows.map((row) =>
        stripPathwayLessonToHubListShape(
          applyOverlayAndStructural(
            withLocaleMeta(normalizeLesson(row, pathwayId), catMeta),
            marketingLocale,
            pathwayId,
            lessonDbOverlays,
          ),
        ),
      ),
      pathwayId,
    ),
  );
  const dedupedCatalog = dedupePathwayLessonsForLibrary(contextItems, {
    pathwayIdHint: pathwayId,
    source: `hub_page:${pathwayId}:catalog`,
    devLog: true,
  });
  return {
    items: dedupedCatalog.items,
    total,
    page: safePage,
    pageSize: ps,
    pageCount,
    locale: {
      requested,
      effective: "en",
      usedEnglishFallback: requested !== "en",
      catalogEnglishOnlySource: true,
    },
  };
}

async function getPathwayLessonsPageWithDataCache(
  pathwayId: string,
  page: number,
  pageSize: number,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<PathwayLessonsPageResult> {
  const topicKey = JSON.stringify(listOptions?.topicSlugsIn?.slice().sort() ?? []);
  const qKey = listOptions?.q ?? "";
  return unstable_cache(
    async () => getPathwayLessonsPageImpl(pathwayId, page, pageSize, marketingLocale, listOptions),
    ["pathway-hub-all", pathwayId, String(page), String(pageSize), marketingLocale ?? "", topicKey, qKey],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [`pathway-lessons:${pathwayId}`] },
  )();
}

/** Dedupes identical hub list fetches within a single request (metadata + page, etc.). */
export const getPathwayLessonsPage = cache(getPathwayLessonsPageWithDataCache);
/**
 * Non-persistent cached variant for live hubs that must reflect recent imports immediately.
 * Uses request-scope memoization only (React cache), bypassing Next Data Cache.
 */
export const getPathwayLessonsPageFresh = cache(async function getPathwayLessonsPageFresh(
  pathwayId: string,
  page: number,
  pageSize: number,
  marketingLocale?: string,
  listOptions?: { topicSlugsIn?: string[]; q?: string },
): Promise<PathwayLessonsPageResult> {
  return getPathwayLessonsPageImpl(pathwayId, page, pageSize, marketingLocale, listOptions);
});

export type TopicLessonsPageResult = PathwayLessonsPageResult;

/** Topic cluster page — bounded page through lessons in one topic slug. */
async function getLessonsForTopicPageImpl(
  pathwayId: string,
  topicSlug: string,
  page: number = 1,
  pageSize: number = PATHWAY_HUB_PAGE_SIZE_DEFAULT,
  marketingLocale?: string,
): Promise<TopicLessonsPageResult> {
  const ps = clampPageSize(pageSize);
  const p = Math.min(clampPage(page), maxSafeOffsetPage(ps));
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedPathwayLessonOverlayMapSafe(requested);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const t0 = performance.now();
    const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
    const total = await dbCall(
      () =>
        prisma.pathwayLesson.count({
          where: { pathwayId, status: ContentStatus.PUBLISHED, topicSlug, locale: effective },
        }),
      0,
    );
    if (total === 0) {
      const catMatched = getCatalogLessonsRaw(pathwayId).filter((l) => l.topicSlug === topicSlug);
      if (catMatched.length > 0) {
        safeServerLog("pathway_lessons", "topic_list_catalog_supplement", {
          pathwayId,
          topicSlug,
          pathwayLessonRuntimeSource: "database",
          catalogSupplementCount: catMatched.length,
        });
        const metaCat = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
        const contextCat = sortAndFilterLessonsForPathwayContext(
          pathwayId,
          filterHubListItemsForSafeSlugs(
            catMatched
              .map((row) =>
                applyOverlayAndStructural(
                  withLocaleMeta(normalizeLesson(row, pathwayId), metaCat),
                  marketingLocale,
                  pathwayId,
                  lessonDbOverlays,
                ),
              )
              .map((full) => stripPathwayLessonToHubListShape(full)),
            pathwayId,
          ),
        );
        const pageCountCat = Math.max(1, Math.ceil(contextCat.length / ps));
        const safePageCat = Math.min(p, pageCountCat);
        const skipCat = (safePageCat - 1) * ps;
        const sliceCat = contextCat.slice(skipCat, skipCat + ps);
        const durationMs = Math.round(performance.now() - t0);
        safeServerLog("pathway_lessons", "topic_list_db_timing", {
          pathwayId,
          topicSlug,
          pathwayLessonRuntimeSource: "database",
          durationMs,
          page: safePageCat,
          pageSize: ps,
          total: contextCat.length,
          catalogSupplement: true,
        });
        const dedupedSliceCat = dedupePathwayLessonsForLibrary(sliceCat, {
          pathwayIdHint: pathwayId,
          source: `topic_page:${pathwayId}:${topicSlug}:catalog_supplement`,
          devLog: true,
        });
        return {
          items: dedupedSliceCat.items,
          total: contextCat.length,
          page: safePageCat,
          pageSize: ps,
          pageCount: pageCountCat,
          locale: {
            requested,
            effective: "en",
            usedEnglishFallback: requested !== "en",
            catalogEnglishOnlySource: true,
          },
        };
      }
      const durationMs = Math.round(performance.now() - t0);
      safeServerLog("pathway_lessons", "topic_list_db_timing", {
        pathwayId,
        topicSlug,
        pathwayLessonRuntimeSource: "database",
        durationMs,
        page: 1,
        pageSize: ps,
        total: 0,
      });
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: ps,
        pageCount: 1,
        locale: {
          requested,
          effective,
          usedEnglishFallback: requested !== effective,
          catalogEnglishOnlySource: false,
        },
      };
    }
    const missingGolds = await listMissingScopedGoldHubRows(pathwayId, effective, [topicSlug]);
    const dbRowsAll = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, topicSlug, locale: effective },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          take: 800,
          select: { ...PATHWAY_LESSON_HUB_LIST_SELECT, sections: true },
        }),
      [],
    );
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    const rawInputs: LessonInput[] = [
      ...missingGolds,
      ...dbRowsAll.map((r) => pathwayLessonRowToInput(r)),
    ];
    const hubReady = sortAndFilterLessonsForPathwayContext(
      pathwayId,
      filterHubListItemsForSafeSlugs(
        rawInputs
          .map((row) =>
            applyOverlayAndStructural(
              withLocaleMeta(normalizeLesson(row, pathwayId), meta),
              marketingLocale,
              pathwayId,
              lessonDbOverlays,
            ),
          )
          .map((full) => stripPathwayLessonToHubListShape(full)),
        pathwayId,
      ),
    );
    const totalReady = hubReady.length;
    const pageCount = Math.max(1, Math.ceil(totalReady / ps));
    const safePage = Math.min(p, pageCount);
    const skip = (safePage - 1) * ps;
    const items = hubReady.slice(skip, skip + ps);
    const durationMs = Math.round(performance.now() - t0);
    safeServerLog("pathway_lessons", "topic_list_db_timing", {
      pathwayId,
      topicSlug,
      pathwayLessonRuntimeSource: "database",
      durationMs,
      page: safePage,
      pageSize: ps,
      total: totalReady,
    });
    const dedupedTopicItems = dedupePathwayLessonsForLibrary(items, {
      pathwayIdHint: pathwayId,
      source: `topic_page:${pathwayId}:${topicSlug}:db`,
      devLog: true,
    });
    return {
      items: dedupedTopicItems.items,
      total: totalReady,
      page: safePage,
      pageSize: ps,
      pageCount,
      locale: {
        requested,
        effective,
        usedEnglishFallback: requested !== effective,
        catalogEnglishOnlySource: false,
      },
    };
  }

  const matched = getCatalogLessonsRaw(pathwayId).filter((l) => l.topicSlug === topicSlug);
  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  const hubCatalog = sortAndFilterLessonsForPathwayContext(
    pathwayId,
    filterHubListItemsForSafeSlugs(
      matched
        .map((row) =>
          applyOverlayAndStructural(
            withLocaleMeta(normalizeLesson(row, pathwayId), catMeta),
            marketingLocale,
            pathwayId,
            lessonDbOverlays,
          ),
        )
        .map((full) => stripPathwayLessonToHubListShape(full)),
      pathwayId,
    ),
  );
  const total = hubCatalog.length;
  const pageCount = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(p, pageCount);
  const skip = (safePage - 1) * ps;
  const contextItems = hubCatalog.slice(skip, skip + ps);
  safeServerLog("pathway_lessons", "topic_list_source", {
    pathwayId,
    topicSlug,
    pathwayLessonRuntimeSource: total > 0 ? "catalog" : "none",
    total,
    page: safePage,
    pageSize: ps,
  });
  const dedupedTopicCatalog = dedupePathwayLessonsForLibrary(contextItems, {
    pathwayIdHint: pathwayId,
    source: `topic_page:${pathwayId}:${topicSlug}:catalog`,
    devLog: true,
  });
  return {
    items: dedupedTopicCatalog.items,
    total,
    page: safePage,
    pageSize: ps,
    pageCount,
    locale: {
      requested,
      effective: "en",
      usedEnglishFallback: requested !== "en",
      catalogEnglishOnlySource: true,
    },
  };
}

async function getLessonsForTopicPageWithDataCache(
  pathwayId: string,
  topicSlug: string,
  page: number,
  pageSize: number,
  marketingLocale?: string,
): Promise<TopicLessonsPageResult> {
  return unstable_cache(
    async () => getLessonsForTopicPageImpl(pathwayId, topicSlug, page, pageSize, marketingLocale),
    ["pathway-topic-page", pathwayId, topicSlug, String(page), String(pageSize), marketingLocale ?? ""],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [`pathway-lessons:${pathwayId}`] },
  )();
}

export const getLessonsForTopicPage = cache(getLessonsForTopicPageWithDataCache);

/** Single lesson by slug — canonical English DB row when present, then file/DB overlays; legacy non-English row if no English. */
async function getPathwayLessonImpl(
  pathwayId: string,
  slug: string,
  marketingLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  const overlayLocale = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedPathwayLessonOverlayMapSafe(overlayLocale);

  const rowEn = await dbCall(
    () =>
      prisma.pathwayLesson.findUnique({
        where: {
          pathwayId_slug_locale: {
            pathwayId,
            slug,
            locale: PATHWAY_LESSON_CANONICAL_DB_LOCALE,
          },
        },
      }),
    null,
  );
  if (rowEn && rowEn.status === ContentStatus.PUBLISHED) {
    return applyOverlayAndStructural(
      withLocaleMeta(
        normalizeLesson(pathwayLessonRowToInput(rowEn), pathwayId),
        lessonLocaleMeta(marketingLocale, PATHWAY_LESSON_CANONICAL_DB_LOCALE, false, false),
      ),
      marketingLocale,
      pathwayId,
      lessonDbOverlays,
    );
  }

  if (overlayLocale !== PATHWAY_LESSON_CANONICAL_DB_LOCALE) {
    const rowRequested = await dbCall(
      () =>
        prisma.pathwayLesson.findUnique({
          where: {
            pathwayId_slug_locale: { pathwayId, slug, locale: overlayLocale },
          },
        }),
      null,
    );
    if (rowRequested && rowRequested.status === ContentStatus.PUBLISHED) {
      return applyOverlayAndStructural(
        withLocaleMeta(
          normalizeLesson(pathwayLessonRowToInput(rowRequested), pathwayId),
          lessonLocaleMeta(marketingLocale, overlayLocale, false, false),
        ),
        marketingLocale,
        pathwayId,
        lessonDbOverlays,
      );
    }
  }

  const dbHasAny = await pathwayHasPublishedDbLessons(pathwayId);
  const hit = getCatalogLessonsRaw(pathwayId).find((l) => l.slug === slug);
  if (!hit) return undefined;
  if (dbHasAny) {
    safeServerLog("pathway_lessons", "lesson_detail_catalog_supplement", {
      pathwayId,
      slug,
      pathwayLessonRuntimeSource: "database",
    });
  }
  return applyOverlayAndStructural(
    withLocaleMeta(
      normalizeLesson(hit, pathwayId),
      lessonLocaleMeta(marketingLocale, PATHWAY_LESSON_CANONICAL_DB_LOCALE, overlayLocale !== "en", true),
    ),
    marketingLocale,
    pathwayId,
    lessonDbOverlays,
  );
}

async function getPathwayLessonWithDataCache(
  pathwayId: string,
  slug: string,
  marketingLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  return unstable_cache(
    async () => getPathwayLessonImpl(pathwayId, slug, marketingLocale),
    ["pathway-lesson-detail", pathwayId, slug, marketingLocale ?? ""],
    {
      revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS,
      tags: [`pathway-lessons:${pathwayId}`, `pathway-lesson:${pathwayId}:${slug}`],
    },
  )();
}

/** Dedupes metadata + page lesson fetches in the same request. */
export const getPathwayLesson = cache(getPathwayLessonWithDataCache);

export type ResolvedPathwayLaunchBundle = {
  spec: PathwayLaunchBundleSpec;
  resolved: Array<{ entry: LaunchBundleEntry; lesson: PathwayLessonRecord }>;
};

/**
 * Resolves the editorial **launch essentials** list for a pathway (independent of hub pagination).
 * Missing slugs are skipped — content can roll out incrementally.
 */
export const resolvePathwayLaunchBundle = cache(async function resolvePathwayLaunchBundle(
  pathwayId: string,
  marketingLocale?: string,
): Promise<ResolvedPathwayLaunchBundle | null> {
  const spec = getLaunchBundleSpec(pathwayId);
  if (!spec) return null;
  const settled = await Promise.allSettled(
    spec.entries.map((e) => getPathwayLesson(pathwayId, e.slug, marketingLocale)),
  );
  const resolved = spec.entries
    .map((entry, i) => {
      const r = settled[i];
      const lesson = r?.status === "fulfilled" ? r.value : undefined;
      if (!lesson || !lesson.structuralQuality?.publicComplete) return null;
      return { entry, lesson };
    })
    .filter((x): x is { entry: LaunchBundleEntry; lesson: PathwayLessonRecord } => x !== null);
  return { spec, resolved };
});

/**
 * Progress API: accept lesson completion if slug exists in any published locale (prefer `en` row when duplicated).
 */
export async function getPathwayLessonForProgress(pathwayId: string, slug: string): Promise<PathwayLessonRecord | undefined> {
  const rowEn = await dbCall(
    () =>
      prisma.pathwayLesson.findUnique({
        where: { pathwayId_slug_locale: { pathwayId, slug, locale: "en" } },
      }),
    null,
  );
  if (rowEn && rowEn.status === ContentStatus.PUBLISHED) {
    return normalizeLesson(pathwayLessonRowToInput(rowEn), pathwayId);
  }
  const rowAny = await dbCall(
    () =>
      prisma.pathwayLesson.findFirst({
        where: { pathwayId, slug, status: ContentStatus.PUBLISHED },
        orderBy: [{ locale: "asc" }],
      }),
    null,
  );
  if (rowAny) return normalizeLesson(pathwayLessonRowToInput(rowAny), pathwayId);
  const hit = getCatalogLessonsRaw(pathwayId).find((l) => l.slug === slug);
  return hit ? normalizeLesson(hit, pathwayId) : undefined;
}

/**
 * App shell `/app/lessons/[id]`: load a published DB row by primary key (no catalog fallback).
 * Callers must enforce access with {@link appPathwayLessonVisibleToSubscriber}.
 */
export async function getPublishedPathwayLessonRecordById(
  id: string,
  marketingLocale?: string,
): Promise<PathwayLessonRecord | undefined> {
  const row = await dbCall(() => prisma.pathwayLesson.findUnique({ where: { id } }), null);
  if (!row || row.status !== ContentStatus.PUBLISHED) return undefined;
  const lessonDbOverlays = await fetchPublishedPathwayLessonOverlayMapSafe(
    normalizePathwayLessonLocale(marketingLocale),
  );
  const lesson = applyOverlayAndStructural(
    normalizeLesson(pathwayLessonRowToInput(row), row.pathwayId),
    marketingLocale,
    row.pathwayId,
    lessonDbOverlays,
  );
  return lesson;
}

/** Related lessons (same topic) for detail page — capped list, bounded query on DB. */
async function getRelatedPathwayLessonsImpl(
  pathwayId: string,
  topicSlug: string,
  excludeSlug: string,
  limit: number = RELATED_PATHWAY_LESSONS_LIMIT,
  marketingLocale?: string,
  /** When the same-topic list is short, fill up to `limit` with other topics in this body system (deduped). */
  relatedBackfillBodySystem?: string | null,
): Promise<PathwayLessonRecord[]> {
  const cap = Math.min(24, Math.max(1, Math.floor(limit)));
  const requested = normalizePathwayLessonLocale(marketingLocale);
  const lessonDbOverlays = await fetchPublishedPathwayLessonOverlayMapSafe(requested);
  const slugWhere: Prisma.PathwayLessonWhereInput =
    excludeSlug === RELATED_LESSONS_EXCLUDE_SLUG_SENTINEL ? {} : { slug: { not: excludeSlug } };

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: {
            pathwayId,
            status: ContentStatus.PUBLISHED,
            topicSlug,
            locale: effective,
            ...slugWhere,
          },
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          take: Math.min(48, cap * 6),
          select: PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS,
        }),
      [],
    );
    const meta = lessonLocaleMeta(marketingLocale, effective, requested !== effective, false);
    const mapDbRows = (batch: typeof rows) =>
      batch
        .map((r) =>
          applyOverlayAndStructural(
            withLocaleMeta(normalizeLesson(pathwayLessonRowToInput(r), pathwayId), meta),
            marketingLocale,
            pathwayId,
            lessonDbOverlays,
          ),
        )
        .map((full) => stripPathwayLessonToHubListShape(full))
        .filter(pathwayLessonHasRenderableHubSlug);

    let merged = mapDbRows(rows);
    const bsTrim = relatedBackfillBodySystem?.trim();
    if (bsTrim && merged.length < cap) {
      const need = cap - merged.length;
      const seenSlugs = new Set(merged.map((m) => m.slug));
      const backfillRows = await dbCall(
        () =>
          prisma.pathwayLesson.findMany({
            where: {
              pathwayId,
              status: ContentStatus.PUBLISHED,
              locale: effective,
              bodySystem: { equals: bsTrim, mode: "insensitive" },
              topicSlug: { not: topicSlug },
              ...slugWhere,
            },
            orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
            take: Math.min(48, need + 24),
            select: PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS,
          }),
        [],
      );
      const extra = mapDbRows(backfillRows).filter((l) => !seenSlugs.has(l.slug));
      merged = [...merged, ...extra].slice(0, cap);
    }
    return merged;
  }

  const catMeta = lessonLocaleMeta(marketingLocale, "en", requested !== "en", true);
  const catalogPrimary = getCatalogLessonsRaw(pathwayId).filter(
    (l) => l.topicSlug === topicSlug && l.slug !== excludeSlug,
  );
  const bsTrimCat = relatedBackfillBodySystem?.trim();
  let catalogMerged = catalogPrimary;
  if (bsTrimCat && catalogPrimary.length < cap) {
    const need = cap - catalogPrimary.length;
    const seen = new Set(catalogPrimary.map((p) => p.slug));
    const extra = getCatalogLessonsRaw(pathwayId).filter(
      (l) =>
        l.topicSlug !== topicSlug &&
        l.slug !== excludeSlug &&
        !seen.has(l.slug) &&
        (l.bodySystem ?? "").trim().toLowerCase() === bsTrimCat.toLowerCase(),
    );
    catalogMerged = [...catalogPrimary, ...extra.slice(0, need)];
  }

  return catalogMerged
    .map((raw) =>
      applyOverlayAndStructural(
        withLocaleMeta(normalizeLesson(raw, pathwayId), catMeta),
        marketingLocale,
        pathwayId,
        lessonDbOverlays,
      ),
    )
    .map((full) => stripPathwayLessonToHubListShape(full))
    .filter(pathwayLessonHasRenderableHubSlug)
    .slice(0, cap);
}

async function getRelatedPathwayLessonsWithDataCache(
  pathwayId: string,
  topicSlug: string,
  excludeSlug: string,
  limit: number = RELATED_PATHWAY_LESSONS_LIMIT,
  marketingLocale?: string,
  relatedBackfillBodySystem?: string | null,
): Promise<PathwayLessonRecord[]> {
  return unstable_cache(
    async () =>
      getRelatedPathwayLessonsImpl(
        pathwayId,
        topicSlug,
        excludeSlug,
        limit,
        marketingLocale,
        relatedBackfillBodySystem,
      ),
    [
      "pathway-related",
      pathwayId,
      topicSlug,
      excludeSlug,
      String(limit),
      marketingLocale ?? "",
      relatedBackfillBodySystem?.trim().toLowerCase() ?? "",
    ],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [`pathway-lessons:${pathwayId}`] },
  )();
}

export const getRelatedPathwayLessons = cache(getRelatedPathwayLessonsWithDataCache);

async function listPathwayIdsWithDbLessons(): Promise<string[]> {
  return dbCall(
    async () => {
      const groups = await prisma.pathwayLesson.groupBy({
        by: ["pathwayId"],
        where: { status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      });
      return groups.map((g) => g.pathwayId);
    },
    [],
  );
}

/** Pathway IDs that have at least one lesson in DB or catalog (union). */
export async function listPathwayIdsWithLessons(): Promise<string[]> {
  const catalogIds = listCatalogPathwayIdsWithLessonsSync();
  const dbIds = await listPathwayIdsWithDbLessons();
  const merged = new Set([...catalogIds, ...dbIds]);
  return [...merged].sort((a, b) => a.localeCompare(b));
}

export type TopicCluster = { topicSlug: string; label: string; count: number };

/** Topic index from static catalog (used when DB is primary but DB topic aggregates are empty). */
function topicClustersFromCatalogPathway(pathwayId: string): TopicCluster[] {
  const raw = getCatalogLessonsRaw(pathwayId);
  const map = new Map<string, { label: string; count: number }>();
  for (const l of raw) {
    const topicSlug = typeof l.topicSlug === "string" ? l.topicSlug : "";
    if (!topicSlug) continue;
    const label = typeof l.topic === "string" ? l.topic : topicSlug;
    const cur = map.get(topicSlug) ?? { label, count: 0 };
    cur.count += 1;
    map.set(topicSlug, { label: cur.label, count: cur.count });
  }
  return [...map.entries()]
    .map(([topicSlug, v]) => ({ topicSlug, label: v.label, count: v.count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Topic index for a pathway — aggregates only (no full section bodies loaded). */
async function listTopicClustersImpl(pathwayId: string, marketingLocale?: string): Promise<TopicCluster[]> {
  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (dbHas) {
    const effective = await effectiveLocaleForPathwayLessonDbRows(
      pathwayId,
      normalizePathwayLessonLocale(marketingLocale),
    );
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, locale: effective },
          select: { topicSlug: true, topic: true, sections: true, slug: true, title: true, bodySystem: true, seoTitle: true, seoDescription: true, previewSectionCount: true, locale: true },
          take: 2000,
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
        }),
      [],
    );
    const completeRows = rows;
    if (completeRows.length === 0) {
      const catClusters = topicClustersFromCatalogPathway(pathwayId);
      if (catClusters.length > 0) {
        safeServerLog("pathway_lessons", "topic_index_catalog_supplement", {
          pathwayId,
          pathwayLessonRuntimeSource: "database",
          catalogTopicCount: catClusters.length,
        });
        return catClusters;
      }
      return [];
    }
    const bySlug = new Map<string, { label: string; count: number }>();
    for (const row of completeRows) {
      const key = row.topicSlug;
      if (!key) continue;
      const cur = bySlug.get(key) ?? { label: row.topic || key, count: 0 };
      cur.count += 1;
      bySlug.set(key, cur);
    }
    return [...bySlug.entries()]
      .map(([topicSlug, value]) => ({
        topicSlug,
        label: value.label,
        count: value.count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  return topicClustersFromCatalogPathway(pathwayId);
}

async function listTopicClustersWithDataCache(pathwayId: string, marketingLocale?: string): Promise<TopicCluster[]> {
  return unstable_cache(
    async () => listTopicClustersImpl(pathwayId, marketingLocale),
    ["pathway-topic-clusters", pathwayId, marketingLocale ?? ""],
    { revalidate: PATHWAY_LESSON_PUBLIC_REVALIDATE_SECONDS, tags: [`pathway-lessons:${pathwayId}`] },
  )();
}

/** Dedupes topic index work when metadata + page both need clusters in one request. */
export const listTopicClusters = cache(listTopicClustersWithDataCache);

export type PathwayLessonSlugRow = { slug: string; topicSlug: string };

/** Batched slug/topic reads for sitemaps — caller iterates until batch shorter than `batchSize`. */
export async function listPathwayLessonSlugBatch(
  pathwayId: string,
  skip: number,
  batchSize: number = PATHWAY_LESSON_SITEMAP_BATCH,
  contentLocale: string = PATHWAY_LESSON_SITEMAP_LOCALE,
): Promise<PathwayLessonSlugRow[]> {
  const take = Math.min(2000, Math.max(1, Math.floor(batchSize)));
  const sk = Math.max(0, Math.floor(skip));
  const loc = normalizePathwayLessonLocale(contentLocale);

  const dbHas = await pathwayHasPublishedDbLessons(pathwayId);
  if (sk === 0) {
    const catN = getCatalogLessonsRaw(pathwayId).length;
    safeServerLog("pathway_lessons", "sitemap_batch_source", {
      pathwayId,
      locale: loc,
      pathwayLessonRuntimeSource: dbHas ? "database" : catN > 0 ? "catalog" : "none",
    });
  }

  const lessonDbOverlays = await fetchPublishedPathwayLessonOverlayMapSafe(loc);

  if (dbHas) {
    const rows = await dbCall(
      () =>
        prisma.pathwayLesson.findMany({
          where: { pathwayId, status: ContentStatus.PUBLISHED, locale: loc },
          select: PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS,
          orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
          skip: sk,
          take,
        }),
      [],
    );
    const meta = lessonLocaleMeta(undefined, loc, false, false);
    return rows
      .map((r) =>
        applyOverlayAndStructural(
          withLocaleMeta(normalizeLesson(pathwayLessonRowToInput(r), pathwayId), meta),
          undefined,
          pathwayId,
          lessonDbOverlays,
        ),
      )
      .map((l) => ({ slug: l.slug, topicSlug: l.topicSlug }));
  }

  const raw = getCatalogLessonsRaw(pathwayId).slice(sk, sk + take);
  const metaCat = lessonLocaleMeta(
    undefined,
    PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    loc !== PATHWAY_LESSON_CANONICAL_DB_LOCALE,
    true,
  );
  return raw
    .map((hit) =>
      applyOverlayAndStructural(
        withLocaleMeta(normalizeLesson(hit, pathwayId), metaCat),
        undefined,
        pathwayId,
        lessonDbOverlays,
      ),
    )
    .map((l) => ({ slug: l.slug, topicSlug: l.topicSlug }));
}

/** Total lessons for pathway — count/sum only (audit, metrics). */
export async function countPathwayLessons(pathwayId: string): Promise<number> {
  return countPathwayLessonsDbOnly(pathwayId);
}

/** DB-only pathway lesson count (internal/admin/reporting semantics). */
export async function countPathwayLessonsDbOnly(pathwayId: string): Promise<number> {
  const dbState = await countPublishedDbLessonsAllLocalesWithHealth(pathwayId);
  if (dbState.unavailable) return 0;
  const dbN = dbState.count;
  if (dbN > 0) return dbN;
  return getCatalogLessonsRaw(pathwayId).length;
}

/**
 * Public-facing pathway lesson total for hubs/libraries.
 * Matches fresh loader inclusion semantics: published DB rows + scoped-gold hub rows not yet in DB.
 */
export async function countPathwayLessonsPublic(
  pathwayId: string,
  marketingLocale?: string,
): Promise<number> {
  const dbState = await countPublishedDbLessonsAllLocalesWithHealth(pathwayId);
  if (dbState.unavailable) return 0;
  if (dbState.count <= 0) return getCatalogLessonsRaw(pathwayId).length;

  const requested = normalizePathwayLessonLocale(marketingLocale);
  const effective = await effectiveLocaleForPathwayLessonDbRows(pathwayId, requested);
  const dbTotal = await countPublishedLessonRows(pathwayId, effective);
  const missingGolds = await listMissingScopedGoldHubRows(pathwayId, effective);
  return dbTotal + missingGolds.length;
}
