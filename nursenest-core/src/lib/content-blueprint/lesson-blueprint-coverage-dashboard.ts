/**
 * Lesson library coverage vs blueprint planning weights (catalog.json only — no DB).
 * Complements `buildExamBlueprintCoverageReport` (question-bank heavy).
 */
import type { BlueprintDomainId } from "./blueprint-domain";
import { BLUEPRINT_DOMAIN_LABELS } from "./blueprint-domain";
import type { ClinicalSystemId } from "./clinical-system-id";
import { CLINICAL_SYSTEM_LABELS, inferClinicalSystemFromHaystack } from "./clinical-system-id";
import { buildPathwayBlueprintProfile } from "./pathway-blueprint-profiles";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

/** Editorial floor / long-term stretch for static pathway lesson libraries. */
export const LESSON_LIBRARY_MIN = 150;
export const LESSON_LIBRARY_STRETCH = 500;

export type LessonCatalogLessonType = "catalog_legacy" | "blueprint_wave_curated" | "blueprint_wave_padded";

const DOMAIN_IDS = Object.keys(BLUEPRINT_DOMAIN_LABELS) as BlueprintDomainId[];

function isBlueprintDomainId(s: string): s is BlueprintDomainId {
  return (DOMAIN_IDS as string[]).includes(s);
}

type CatalogSection = { kind?: string; body?: string };

type RawLesson = {
  slug?: string;
  title?: string;
  topic?: string;
  topicSlug?: string;
  bodySystem?: string;
  sections?: CatalogSection[];
};

const WAVE_CODE_TO_DOMAIN: Record<string, BlueprintDomainId> = {
  sf: "safety_and_infection",
  mo: "management_of_care",
  ph: "pharmacological_therapies",
  pa: "physiological_adaptation",
  rr: "risk_reduction",
  psy: "psychosocial_integrity",
  hp: "health_promotion_maintenance",
  bc: "basic_care_comfort",
  mat: "physiological_adaptation",
  ped: "physiological_adaptation",
  lab: "physiological_adaptation",
  proc: "basic_care_comfort",
  cs: "management_of_care",
};

const PAD_DOMAIN_RE = /^bp26-[^-]+-pad-\d+-([a-z_]+)-/i;

function inferDomainFromSections(sections: CatalogSection[] | undefined): BlueprintDomainId | null {
  if (!sections?.length) return null;
  const cm = sections.find((s) => s.kind === "clinical_meaning");
  const body = typeof cm?.body === "string" ? cm.body : "";
  const m =
    body.match(/\*\*planning domain\*\*\s*\*\*([a-z_]+)\*\*/i) ||
    body.match(/planning domain\s+\*\*([a-z_]+)\*\*/i) ||
    body.match(/\*\*([a-z_]+)\*\*\s*with teaching focus/i);
  if (m?.[1] && isBlueprintDomainId(m[1])) return m[1];
  return null;
}

/** Heuristic mapping for legacy catalog rows (no bp26 slug) — topic/title/slug strings only. */
export function inferBlueprintDomainFromLessonHaystack(
  topic?: string,
  topicSlug?: string,
  title?: string,
): BlueprintDomainId | null {
  const h = `${topic ?? ""} ${topicSlug ?? ""} ${title ?? ""}`.toLowerCase();
  if (!h.trim()) return null;
  if (
    /(delegat|priorit|sbar|handoff|ethical|leadership|care conference|legal scope|scope of practice|assignment|care coordination|multi-?patient)/.test(
      h,
    )
  ) {
    return "management_of_care";
  }
  if (/(infection|ppe|isolation|sterile|medication safety|fall risk|restraint|fire safety|blood culture|clabsi)/.test(h)) {
    return "safety_and_infection";
  }
  if (/(pharmac|insulin|antibiotic|opioid|anticoag|high-alert|parenteral|medication admin)/.test(h)) {
    return "pharmacological_therapies";
  }
  if (/(psych|mental health|suicide|dementia|therapeutic communication|anxiety|grief|abuse)/.test(h)) {
    return "psychosocial_integrity";
  }
  if (/(immuniz|screen|health promotion|health teaching|growth chart|teach-back|literacy)/.test(h)) {
    return "health_promotion_maintenance";
  }
  if (/(comfort care|adl|hygiene|ng tube|basic care|palliative|end of life)/.test(h)) {
    return "basic_care_comfort";
  }
  if (/(pressure injury|vte prophylax|risk reduction|complication potential)/.test(h)) {
    return "risk_reduction";
  }
  if (
    /(fluid|electrolyte|renal|shock|sepsis|respiratory|cardio|neuro|gi\b|maternity|pediatr|stroke|dka|aki|pathophys|physiological)/.test(
      h,
    )
  ) {
    return "physiological_adaptation";
  }
  return null;
}

export type LessonBlueprintDomainInput = {
  slug?: string;
  title?: string;
  topic?: string;
  topicSlug?: string;
  sections?: CatalogSection[];
};

/**
 * Map a catalog row to an NCLEX-style blueprint domain (best-effort).
 * Prefers explicit `pad-*` slug segments, then wave codes (sf/mo/pa/…),
 * then clinical_meaning parsing, then topic/title heuristics for legacy rows.
 */
export function inferLessonBlueprintDomain(lesson: LessonBlueprintDomainInput): BlueprintDomainId {
  const slug = typeof lesson.slug === "string" ? lesson.slug : "";
  const { sections, topic, topicSlug, title } = lesson;

  const pad = slug.match(PAD_DOMAIN_RE);
  if (pad?.[1] && isBlueprintDomainId(pad[1])) return pad[1];

  if (slug.startsWith("bp26-")) {
    const wave = /^bp26-[^-]+-([a-z]{2,4})-/i.exec(slug);
    const code = wave?.[1]?.toLowerCase();
    if (code && WAVE_CODE_TO_DOMAIN[code]) return WAVE_CODE_TO_DOMAIN[code]!;
    if (/^bp26-[^-]+-x\d+-/i.test(slug)) {
      return (
        inferDomainFromSections(sections) ??
        inferBlueprintDomainFromLessonHaystack(topic, topicSlug, title) ??
        "uncategorized"
      );
    }
  }

  if (!slug.startsWith("bp26-")) {
    return (
      inferDomainFromSections(sections) ??
      inferBlueprintDomainFromLessonHaystack(topic, topicSlug, title) ??
      "uncategorized"
    );
  }

  return inferDomainFromSections(sections) ?? inferBlueprintDomainFromLessonHaystack(topic, topicSlug, title) ?? "uncategorized";
}

export function inferLessonCatalogType(slug: string): LessonCatalogLessonType {
  if (!slug.startsWith("bp26-")) return "catalog_legacy";
  if (/-pad-\d+-/i.test(slug)) return "blueprint_wave_padded";
  return "blueprint_wave_curated";
}

function clinicalSystemForLesson(lesson: RawLesson): ClinicalSystemId {
  const hay = `${lesson.bodySystem ?? ""} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""}`;
  return inferClinicalSystemFromHaystack(hay);
}

export type DomainCountRow = {
  domain: BlueprintDomainId;
  label: string;
  count: number;
  /** Share of pathway lessons in this domain. */
  pctOfPathway: number;
  /** planning weight from pathway profile (0 if unknown). */
  planningWeight: number;
  /** Rough expected count = round(weight * totalLessons). */
  expectedApprox: number;
};

export type SystemCountRow = {
  system: ClinicalSystemId;
  label: string;
  count: number;
  pctOfPathway: number;
};

export type LessonTypeCountRow = {
  type: LessonCatalogLessonType;
  label: string;
  count: number;
  pctOfPathway: number;
};

export type PathwayLessonBlueprintCoverage = {
  pathwayId: string;
  displayName: string;
  totalLessons: number;
  progress: {
    minFloor: number;
    stretchGoal: number;
    /** 0–100 capped */
    pctOfMinFloor: number;
    /** 0–100 capped */
    pctOfStretchGoal: number;
    lessonsShortOfMin: number;
    lessonsShortOfStretch: number;
  };
  byDomain: DomainCountRow[];
  byClinicalSystem: SystemCountRow[];
  byLessonType: LessonTypeCountRow[];
  /** Domains under ~half of weight-adjusted expectation (planning signal). */
  weakDomains: Array<{ domain: BlueprintDomainId; label: string; count: number; expectedApprox: number }>;
  /** Systems in bottom tier by count (detail areas). */
  weakSystems: Array<{ system: ClinicalSystemId; label: string; count: number }>;
  /** Human-readable bullets for backlog / standups. */
  majorGaps: string[];
};

export type LessonBlueprintCoverageDashboard = {
  generatedAt: string;
  dataSource: "src/content/pathway-lessons/catalog.json";
  pathwayIdsIncluded: string[];
  pathways: PathwayLessonBlueprintCoverage[];
};

function emptyDomainCounts(): Record<BlueprintDomainId, number> {
  const o = {} as Record<BlueprintDomainId, number>;
  for (const d of DOMAIN_IDS) o[d] = 0;
  return o;
}

function buildPathwayRow(
  pathwayId: string,
  lessons: RawLesson[],
): PathwayLessonBlueprintCoverage {
  const pathway = getExamPathwayById(pathwayId);
  const displayName = pathway?.displayName ?? pathwayId;
  const profile = pathway ? buildPathwayBlueprintProfile(pathway) : null;

  const total = lessons.length;
  const domainRaw = emptyDomainCounts();
  const systemRaw: Partial<Record<ClinicalSystemId, number>> = {};
  const typeRaw: Record<LessonCatalogLessonType, number> = {
    catalog_legacy: 0,
    blueprint_wave_curated: 0,
    blueprint_wave_padded: 0,
  };

  for (const L of lessons) {
    const slug = typeof L.slug === "string" ? L.slug : "";
    const dom = inferLessonBlueprintDomain(L);
    domainRaw[dom] = (domainRaw[dom] ?? 0) + 1;
    const sys = clinicalSystemForLesson(L);
    systemRaw[sys] = (systemRaw[sys] ?? 0) + 1;
    typeRaw[inferLessonCatalogType(slug)] += 1;
  }

  const byDomain: DomainCountRow[] = DOMAIN_IDS.map((domain) => {
    const count = domainRaw[domain] ?? 0;
    const w = profile?.domainTargets[domain]?.weight ?? 0;
    const expectedApprox = w > 0 && total > 0 ? Math.max(1, Math.round(w * total)) : 0;
    return {
      domain,
      label: BLUEPRINT_DOMAIN_LABELS[domain],
      count,
      pctOfPathway: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
      planningWeight: w,
      expectedApprox,
    };
  }).filter((r) => r.domain !== "uncategorized" || r.count > 0);

  const uncategorized = domainRaw.uncategorized ?? 0;
  if (uncategorized > 0) {
    byDomain.push({
      domain: "uncategorized",
      label: BLUEPRINT_DOMAIN_LABELS.uncategorized,
      count: uncategorized,
      pctOfPathway: total > 0 ? Math.round((uncategorized / total) * 1000) / 10 : 0,
      planningWeight: 0,
      expectedApprox: 0,
    });
  }

  const systems = (Object.keys(CLINICAL_SYSTEM_LABELS) as ClinicalSystemId[]).map((system) => {
    const count = systemRaw[system] ?? 0;
    return {
      system,
      label: CLINICAL_SYSTEM_LABELS[system],
      count,
      pctOfPathway: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    };
  });
  systems.sort((a, b) => b.count - a.count);

  const typeLabels: Record<LessonCatalogLessonType, string> = {
    catalog_legacy: "Catalog (pre-wave)",
    blueprint_wave_curated: "Blueprint wave (curated)",
    blueprint_wave_padded: "Blueprint wave (padded integrated review)",
  };
  const byLessonType: LessonTypeCountRow[] = (Object.keys(typeRaw) as LessonCatalogLessonType[]).map((type) => {
    const count = typeRaw[type];
    return {
      type,
      label: typeLabels[type],
      count,
      pctOfPathway: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    };
  });

  const weakDomains: PathwayLessonBlueprintCoverage["weakDomains"] = [];
  if (profile && total > 0) {
    const scored = DOMAIN_IDS.filter((d) => d !== "uncategorized")
      .map((domain) => {
        const count = domainRaw[domain] ?? 0;
        const w = profile.domainTargets[domain]?.weight ?? 0;
        const expectedApprox = w > 0 ? Math.max(1, Math.round(w * total)) : 0;
        const ratio = expectedApprox > 0 ? count / expectedApprox : 1;
        return { domain, label: BLUEPRINT_DOMAIN_LABELS[domain], count, expectedApprox, w, ratio };
      })
      .filter((x) => x.w > 0 && x.expectedApprox >= 2)
      .sort((a, b) => a.ratio - b.ratio);
    for (const row of scored.slice(0, 5)) {
      if (row.ratio < 0.55 || row.count === 0) {
        weakDomains.push({
          domain: row.domain,
          label: row.label,
          count: row.count,
          expectedApprox: row.expectedApprox,
        });
      }
    }
  }

  const weakSystems: PathwayLessonBlueprintCoverage["weakSystems"] = [...systems]
    .sort((a, b) => a.count - b.count)
    .slice(0, 6)
    .map(({ system, label, count }) => ({ system, label, count }));

  const paddedShare = total > 0 ? typeRaw.blueprint_wave_padded / total : 0;
  const majorGaps: string[] = [];
  if (total < LESSON_LIBRARY_MIN) {
    majorGaps.push(`Below ${LESSON_LIBRARY_MIN}-lesson editorial floor: add ${LESSON_LIBRARY_MIN - total} lessons (or confirm pathway intentionally smaller).`);
  }
  if (total < LESSON_LIBRARY_STRETCH) {
    majorGaps.push(`Stretch catalog goal (${LESSON_LIBRARY_STRETCH}): ${LESSON_LIBRARY_STRETCH - total} lessons remaining for long-term depth.`);
  }
  for (const w of weakDomains.slice(0, 3)) {
    majorGaps.push(
      `Domain gap — ${w.label}: ${w.count} lessons vs ~${w.expectedApprox} weight-adjusted expectation.`,
    );
  }
  if (paddedShare >= 0.35 && total >= 20) {
    majorGaps.push(
      `Padded integrated-review share is ${Math.round(paddedShare * 100)}% — prioritize replacing placeholders with specific titles where editorial capacity allows.`,
    );
  }
  const zeroDomains = byDomain.filter((d) => d.count === 0 && d.planningWeight > 0.08);
  for (const z of zeroDomains.slice(0, 3)) {
    majorGaps.push(`No lessons tagged to ${z.label} — add at least one high-yield lesson in this NCLEX domain.`);
  }

  return {
    pathwayId,
    displayName,
    totalLessons: total,
    progress: {
      minFloor: LESSON_LIBRARY_MIN,
      stretchGoal: LESSON_LIBRARY_STRETCH,
      pctOfMinFloor: total > 0 ? Math.min(100, Math.round((total / LESSON_LIBRARY_MIN) * 1000) / 10) : 0,
      pctOfStretchGoal: total > 0 ? Math.min(100, Math.round((total / LESSON_LIBRARY_STRETCH) * 1000) / 10) : 0,
      lessonsShortOfMin: Math.max(0, LESSON_LIBRARY_MIN - total),
      lessonsShortOfStretch: Math.max(0, LESSON_LIBRARY_STRETCH - total),
    },
    byDomain,
    byClinicalSystem: systems,
    byLessonType,
    weakDomains,
    weakSystems,
    majorGaps,
  };
}

/**
 * Build a planning dashboard from static catalog JSON.
 * Defaults to every pathway key present in the catalog file; pass `pathwayIds` to limit (e.g. {@link BLUEPRINT_REPORT_PATHWAY_IDS} only).
 */
export function buildLessonBlueprintCoverageDashboard(
  catalog: { pathways?: Record<string, { lessons?: RawLesson[] }> },
  options?: { pathwayIds?: readonly string[] },
): LessonBlueprintCoverageDashboard {
  const allKeys = Object.keys(catalog.pathways ?? {});
  const wanted = options?.pathwayIds?.length ? [...options.pathwayIds] : allKeys;
  const pathwayIdsIncluded = wanted.filter((id) => {
    const L = catalog.pathways?.[id]?.lessons;
    return Array.isArray(L);
  });

  const pathways = pathwayIdsIncluded.map((pathwayId) => {
    const lessons = catalog.pathways?.[pathwayId]?.lessons ?? [];
    return buildPathwayRow(pathwayId, lessons);
  });

  pathways.sort((a, b) => a.pathwayId.localeCompare(b.pathwayId));

  return {
    generatedAt: new Date().toISOString(),
    dataSource: "src/content/pathway-lessons/catalog.json",
    pathwayIdsIncluded,
    pathways,
  };
}
